import Mixer from './mixer';
import InputData from './inputData';
import MixData from './mixData';
import Queue from './queue';
import * as dgram from 'dgram';
import { Socket } from 'dgram';
import OscMessage, { OscParameter, OscParameterType } from './oscMessage';
import mixers from './mixers.json';
import { perpetuallyIterateOverArray } from '../utils/perpetualIteration';
import MixerUpdateCallbacks from './mixerUpdateCallbacks';
import { b64Encode } from '../common/b64';

/**
 * Helper function to close UDP sockets.
 * Handles exceptions gracefully.
 *
 * @param connection The Socket to be closed
 * @param silent If true, won't log any errors.
 */
const close = (connection: Socket | null, silent = false) => {
  try {
    connection?.close();
  } catch (e) {
    if (!silent) {
      console.log('Closing the connection failed', e);
    }
  }
};

/**
 * This interface combines an OSC message that is to be sent
 * and an optional function that handles the closing of the UDP socket.
 */
interface QueuedMessageWithCloseFunction {
  /**
   * The OSC message to be sent.
   */
  msg: Buffer;

  /**
   * An optional function that handles the closing of the UDP connection.
   * Will be called immediately after the message is sent.
   * Receives the connection as an argument.
   * If omitted, the default closing strategy will apply.
   */
  close?: (connection: Socket) => void;
}

/**
 * OSC message or OSC message with associated closing strategy.
 */
type QueuedMessage = QueuedMessageWithCloseFunction | Buffer;

/**
 * This class represents the Behringer X32 mixer.
 * It handles the communication with the actual mixing console.
 */
class BehringerX32 extends Mixer {
  /**
   * The identifier of this type of mixing console.
   */
  static readonly mixerName = 'Behringer X32';

  /**
   * The identifiers of all inputs of this mixer.
   * Provided here as static field for convenient access.
   */
  static readonly inputs = mixers[BehringerX32.mixerName]?.inputs ?? [];

  /**
   * The identifiers of all mixes of this mixer.
   * Provided here as static field for convenient access.
   */
  static readonly mixes = mixers[BehringerX32.mixerName]?.mixes ?? [];

  /**
   * The minimum amount of time (in ms) between to sent OSC messages.
   */
  private readonly CMD_INTERVAL = 2;

  /**
   * The interval (in ms) between two /xremote messages.
   * Also used for meters.
   */
  private readonly XREMOTE_INTERVAL = 8_000;

  /**
   * The interval (in ms) between two messages for querying the console state.
   * The goal of such messages is to eventually sync both states,
   * even if some UDP packets are lost.
   */
  private readonly QUERY_INTERVAL = 250;

  /**
   * The port on which the actual mixing console listens for UDP connections.
   */
  private readonly PORT = 10023;

  /**
   * The maximum time (in ms) after which a UDP socket is forcibly closed.
   */
  private readonly UDP_TIMEOUT = 10_000;

  /**
   * The OSC messages to be sent are gathered in this queue.
   * This is to ensure the minimum interval between two messages.
   */
  private readonly queue = new Queue<QueuedMessage>(this.CMD_INTERVAL);

  /**
   * An iterator that indefinitely yields OSC messages for querying the console state
   * to ensure ultimate consistency.
   */
  private readonly queryIterator: Generator<Buffer>;

  /**
   * An array that holds all OSC messages needed for querying the console state
   * to ensure ultimate consistency.
   */
  private readonly queryBuffers: Buffer[];

  /**
   * The socket of the currently used xremote connection.
   */
  private xremoteConnection: Socket | null = null;

  /**
   * The socket of the currently used meters2 connection.
   * Meter values must be queried by two different messages here (meters2 and meters13).
   */
  private meters2Connection: Socket | null = null;

  /**
   * The socket of the currently used meters13 connection.
   * Meter values must be queried by two different messages here (meters2 and meters13).
   */
  private meters13Connection: Socket | null = null;

  /**
   * The currently used interval timer for triggering /xremote and meters messages.
   */
  private xremoteInterval: NodeJS.Timer | null = null;

  /**
   * The currently used interval timer for triggering the query messages.
   */
  private queryInterval: NodeJS.Timer | null = null;

  /**
   * Contains the name (can be configured on the mixing console) associated with each mix.
   * Indexed by mix identifier.
   */
  private mixNames: Record<string, string> = {};

  /**
   * Contains the color (can be configured on the mixing console) associated with each mix.
   * Indexed by mix identifier.
   */
  private mixColors: Record<string, string> = {};

  /**
   * Contains the mute status of each mix.
   * Indexed by mix identifier.
   */
  private mixMutes: Record<string, boolean> = {};

  /**
   * Contains the level of each mix.
   * Indexed by mix identifier.
   */
  private mixLevels: Record<string, number> = {};

  /**
   * Contains the name (can be configured on the mixing console) associated with each input.
   * Indexed by input identifier.
   */
  private inputNames: Record<string, string> = {};

  /**
   * Contains the color (can be configured on the mixing console) associated with each input.
   * Indexed by input identifier.
   */
  private inputColors: Record<string, string> = {};

  /**
   * Contains the mute status of each input for every mix send.
   * Indexed by mix identifier on the top-most layer, then by input identifier.
   */
  private inputMutes: Record<string, Record<string, boolean>> = {};

  /**
   * Contains the level of each input for every mix send.
   * Indexed by mix identifier on the top-most layer, then by input identifier.
   */
  private inputLevels: Record<string, Record<string, number>> = {};

  /**
   * Contains the meters level for every input and mix.
   * Indexed by mix or input indentifier.
   */
  private meters: Record<string, number | undefined> = {};

  /**
   * Holds all registered mixer update callbacks.
   */
  private callbacks: MixerUpdateCallbacks[] = [];

  /**
   * Initializes a new Behringer X32.
   * Sets up the internal data and starts communications with the actual mixer.
   * @param ip The IP address of the mixing console.
   */
  constructor(ip: string) {
    super(ip);

    // Initialize the first layer of indices to allow for easier access later on.
    BehringerX32.mixes.forEach((mixId) => {
      this.inputMutes[mixId] = {};
      this.inputLevels[mixId] = {};
    });

    // Set up the queue to send the OSC messages.
    this.queue.addHandler((val) => this.sendCommand(val));

    // Initialize an array that contains all OSC messages that are needed to query the relevant mixer data.
    this.queryBuffers = [
      ...BehringerX32.mixes.flatMap((mixId) => {
        const mixPath = mixId.replace('-', '/');
        return [
          new OscMessage('/node', `${mixPath}/config`).toBuffer(),
          new OscMessage(`/${mixPath}/mix/on`).toBuffer(),
          new OscMessage(`/${mixPath}/mix/fader`).toBuffer(),
        ];
      }),
      ...BehringerX32.inputs.flatMap((inputId) => {
        const inputPath = inputId.replace('-', '/');
        return [
          new OscMessage('/node', `${inputPath}/config`).toBuffer(),
          ...BehringerX32.mixes.flatMap((mixId) => {
            const muteSend = BehringerX32.mixNameToDestination(mixId, true);
            const levelSend = BehringerX32.mixNameToDestination(mixId, false);
            return [
              new OscMessage(`/${inputPath}/mix/${muteSend}`).toBuffer(),
              new OscMessage(`/${inputPath}/mix/${levelSend}`).toBuffer(),
            ];
          }),
        ];
      }),
    ];

    // Initialize the query messages iterator.
    this.queryIterator = perpetuallyIterateOverArray(this.queryBuffers);

    // Start the communication with the console.
    this.startListening();
  }

  /**
   * Change the IP address by which the mixer is accessed.
   *
   * @param ip The new IP address of the mixer.
   */
  setIp(ip: string) {
    super.setIp(ip);
    this.stopListening();
    this.startListening();
  }

  /**
   * Stops communication with the mixer console.
   */
  stop() {
    this.stopListening();
  }

  /**
   * Get the InputData for a given input/mix combination.
   * In case the actual data isn't available, fallback data may be used.
   *
   * @param mixId The identifier of the mix to which the input sends to.
   * @param inputId The identifier of the input whose data is requested.
   */
  getInputData(mixId: string, inputId: string): InputData {
    return {
      id: inputId,
      name: this.inputNames[inputId] ?? inputId.toUpperCase(),
      color: this.inputColors[inputId] ?? 'white',
      level: this.inputLevels[mixId][inputId] ?? 0,
      mute: this.inputMutes[mixId][inputId] ?? true,
    };
  }

  /**
   * Get the MixData for a given mix.
   * In case the actual data isn't available, fallback data may be used.
   *
   * @param id The identifier of the mix whose data is requested.
   */
  getMixData(id: string): MixData {
    return {
      id: id,
      name: this.mixNames[id] ?? id.toUpperCase(),
      color: this.mixColors[id] ?? 'white',
      level: this.mixLevels[id] ?? 0,
      mute: this.mixMutes[id] ?? true,
    };
  }

  /**
   * Get a meters string that indicates the current meter levels of inputs and/or mixes.
   * Each character of the string corresponds to the input or mix given at the respective index.
   * The characters are base64 encoded and can represent values between 0 and 63.
   *
   * @param ids The list of input/mix IDs for which the meter values are requested.
   */
  getMetersString(ids: string[]): string {
    return ids.map((id) => b64Encode(this.meters[id] ?? 0)).join('');
  }

  /**
   * Register callbacks that are called when changes occur on the mixer.
   *
   * @param callbacks The callbacks to be registered.
   */
  registerListeners(callbacks: MixerUpdateCallbacks): void {
    this.callbacks.push(callbacks);
  }

  /**
   * Remove callbacks that were previously registered.
   *
   * @param callbacks The exact same callbacks instance that was previously registered and is now to be removed.
   */
  unregisterListeners(callbacks: MixerUpdateCallbacks): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callbacks);
  }

  /**
   * Get the identifier of this type of mixing console.
   */
  getMixerName(): string {
    return BehringerX32.mixerName;
  }

  /**
   * Set a new level for an input or mix.
   * If input is null, the level change affects the mix itself,
   * otherwise, it affects the level with which the given input sends to the given mix.
   *
   * @param level The new level as a float between 0 and 1.
   * @param mix The mix that is affected by this change.
   * @param input The input that is affected by this change or null if the mix itself is to be changed.
   */
  setLevel(level: number, mix: string, input: string | null): void {
    // Ignore invalid identifiers.
    if (
      !BehringerX32.mixes.includes(mix) ||
      (input !== null && !BehringerX32.inputs.includes(input))
    ) {
      return;
    }

    // Queue an OSC message to change the level.
    this.queue.queueValue(
      new OscMessage(
        input === null
          ? `/${mix.replace('-', '/')}/mix/fader`
          : `/${input.replace(
              '-',
              '/',
            )}/mix/${BehringerX32.mixNameToDestination(mix, false)}`,
        [{ type: OscParameterType.FLOAT, value: level }],
      ).toBuffer(),
    );
  }

  /**
   * Set a new mute status for an input or mix.
   * If input is null, the mute change affects the mix itself,
   * otherwise, it affects the whether the given input sends to the given mix.
   *
   * @param state True if the signal should be muted, otherwise false.
   * @param mix The mix that is affected by this change.
   * @param input The input that is affected by this change or null if the mix itself is to be changed.
   */
  setMute(state: boolean, mix: string, input: string | null): void {
    // Ignore invalid identifiers.
    if (
      !BehringerX32.mixes.includes(mix) ||
      (input !== null && !BehringerX32.inputs.includes(input))
    ) {
      return;
    }

    // Queue an OSC message to change the mute status.
    this.queue.queueValue(
      new OscMessage(
        input === null
          ? `/${mix.replace('-', '/')}/mix/on`
          : `/${input.replace(
              '-',
              '/',
            )}/mix/${BehringerX32.mixNameToDestination(mix, true)}`,
        [{ type: OscParameterType.INT, value: state ? 0 : 1 }],
      ).toBuffer(),
    );
  }

  /**
   * Starts communications with the mixing console.
   * Starts listening for changes on the mixer and meter updates.
   * Also starts the query loop to keep the data ultimately consistent.
   * In order to initialize the data of this object, it will queue all query messages at once at the beginning.
   */
  private startListening() {
    // Construct a xremote message with associated closing strategy for the queue.
    const xremote: QueuedMessage = {
      msg: new OscMessage('/xremote').toBuffer(),
      close: (connection: Socket) => {
        close(this.xremoteConnection);
        this.xremoteConnection = connection;
      },
    };

    // Construct a meters2 and a meters13 message with associated closing strategy for the queue.
    // Both meters2 and meters13 are needed, as both only provide a part of the needed meter values.
    // See the function `handleMetersMessage` for the full list of identifiers covered by each one.
    // Request an update every 500ms.
    const meters2: QueuedMessage = {
      msg: new OscMessage('/meters', [
        { type: OscParameterType.STRING, value: '/meters/2' },
        { type: OscParameterType.INT, value: 0 },
        { type: OscParameterType.INT, value: 0 },
        { type: OscParameterType.INT, value: 10 },
      ]).toBuffer(),
      close: (connection: Socket) => {
        close(this.meters2Connection);
        this.meters2Connection = connection;
      },
    };
    const meters13: QueuedMessage = {
      msg: new OscMessage('/meters', [
        { type: OscParameterType.STRING, value: '/meters/13' },
        { type: OscParameterType.INT, value: 0 },
        { type: OscParameterType.INT, value: 0 },
        { type: OscParameterType.INT, value: 10 },
      ]).toBuffer(),
      close: (connection: Socket) => {
        close(this.meters13Connection);
        this.meters13Connection = connection;
      },
    };

    // Initially queue all those messages.
    this.queue.queueValue(xremote);
    this.queue.queueValue(meters2);
    this.queue.queueValue(meters13);

    // Start an interval for further queuing of said messages.
    this.xremoteInterval = setInterval(() => {
      this.queue.queueValue(xremote);
      this.queue.queueValue(meters2);
      this.queue.queueValue(meters13);
    }, this.XREMOTE_INTERVAL);
    this.xremoteInterval.unref();

    // Queue all query messages at once for initialization purposes.
    this.queryBuffers.forEach((buffer) => this.queue.queueValue(buffer));

    // Start an interval for regularly sending one query message to ultimately keep the data in sync.
    this.queryInterval = setInterval(
      () => this.queue.queueValue(this.queryIterator.next().value),
      this.QUERY_INTERVAL,
    );
    this.queryInterval.unref();
  }

  /**
   * Stops communication with the mixing console and clears the intervals.
   * This method is important for avoiding memory leaks.
   */
  private stopListening() {
    // Stop xremote interval loop.
    if (this.xremoteInterval !== null) {
      clearInterval(this.xremoteInterval);
      this.xremoteInterval = null;
    }

    // Close the xremote and meters connections immediately.
    close(this.xremoteConnection);
    this.xremoteConnection = null;
    close(this.meters2Connection);
    this.meters2Connection = null;
    close(this.meters13Connection);
    this.meters13Connection = null;

    // Stop query interval loop.
    if (this.queryInterval !== null) {
      clearInterval(this.queryInterval);
      this.queryInterval = null;
    }
  }

  /**
   * Actually send a queued OSC command.
   *
   * @param queuedMessage The message to be sent.
   */
  private sendCommand(queuedMessage: QueuedMessage) {
    // Extract the actual OSC message
    const msg = 'msg' in queuedMessage ? queuedMessage.msg : queuedMessage;

    // Create a UDP connection.
    const connection = dgram.createSocket('udp4');
    connection.on('message', (msg) => {
      this.handleMixerResponse(msg);

      // If no closing strategy is set,
      // the connection will be closed as soon as the first answer is received.
      if (!('close' in queuedMessage && queuedMessage.close)) {
        close(connection);
      }
    });

    // Fallback to forcibly close the UDP connection after a certain time.
    setTimeout(() => close(connection, true), this.UDP_TIMEOUT).unref();

    // Send the OSC message via the created socket.
    connection.send(msg, 0, msg.length, this.PORT, this.ip);

    // If there is a special closing handler for the message, call it.
    if ('close' in queuedMessage) {
      queuedMessage.close?.(connection);
    }
  }

  /**
   * Convert the color codes used by the X32 to color codes used by SimpleVolumeControl.
   *
   * @param color The X32 color code to be converted.
   */
  private static colorCodeToName(color: string): string {
    switch (color) {
      case 'GN':
      case 'GNi':
        return 'green';
      case 'CY':
      case 'CYi':
        return 'lightblue';
      case 'BL':
      case 'BLi':
        return 'blue';
      case 'MG':
      case 'MGi':
        return 'pink';
      case 'RD':
      case 'RDi':
        return 'red';
      case 'YE':
      case 'YEi':
        return 'yellow';
      default:
        return 'white';
    }
  }

  /**
   * Convert the color indices used by the X32 to color codes used by the X32.
   *
   * @param color The color index to be converted.
   */
  private static colorIntToCode(color: number): string {
    // prettier-ignore
    return (
      [
        'OFF', 'RD', 'GN', 'YE', 'BL', 'MG', 'CY', 'WH',
        'OFFi', 'RDi', 'GNi', 'YEi', 'BLi', 'MGi', 'CYi', 'WHi',
      ][color] ?? 'OFF'
    );
  }

  /**
   * Convert the send destination names used by the X32 to mix identifiers.
   * Returns null for invalid destinations.
   *
   * @param destination The send destination name to be converted.
   */
  private static destinationToMixName(destination: string): string | null {
    switch (destination) {
      case 'st':
      case 'fader':
        return 'main-st';
      case 'mono':
      case 'mlevel':
        return 'main-m';
      case 'on':
        return null;
      default:
        return `bus-${destination.substring(0, 2)}`;
    }
  }

  /**
   * Convert a mix identifier to the according X32 send destination name.
   * Will produce strange results if invalid mix identifiers are given!
   *
   * @param mix The mix identifier to be converted.
   * @param isMute Indicates if a mute command is built (in contrast to a level command).
   */
  private static mixNameToDestination(mix: string, isMute: boolean): string {
    switch (mix) {
      case 'main-st':
        return isMute ? 'st' : 'fader';
      case 'main-m':
        return isMute ? 'mono' : 'mlevel';
      default:
        return `${mix.substring(4)}/${isMute ? 'on' : 'level'}`;
    }
  }

  /**
   * Convert a meter value provided by the X32 to a number between 0 and 20.
   * The function used for conversion is approximated to match the behaviour the X32 uses to illuminate its meter LEDs.
   * The behaviour of this function might change in the future.
   *
   * @param level The meter value provided by the X32.
   */
  private static getNumberOfLEDs(level: number) {
    if (level > 0.97) {
      return 20;
    }
    const leds = Math.round(22.3633 * Math.pow(level, 0.2478) - 2.7771);
    if (leds <= 0 || leds > 20) {
      return 0;
    } else {
      return leds;
    }
  }

  /**
   * Handle messages sent by the X32.
   *
   * @param buffer The message sent by the X32.
   */
  private handleMixerResponse(buffer: Buffer) {
    // Parse the message in order to get an actual OSC message object.
    const msg = OscMessage.fromBuffer(buffer);
    if (
      msg.command === 'node' &&
      msg.parameters.length === 1 &&
      typeof msg.parameters[0].value === 'string'
    ) {
      // Config messages containing name and color.
      const match = msg.parameters[0].value.match(
        /^\/(?<type>ch|auxin|fxrtn|bus|main)\/(?<number>\d\d|st|m)\/config "(?<name>.*)" \d+ (?<color>(?:OFF|RD|GN|YE|BL|MG|CY|WH)i?)+/,
      );
      if (match !== null && match.groups !== undefined) {
        this.handleConfigMessage(
          match.groups.type,
          match.groups.number,
          match.groups.name,
          match.groups.color,
        );
      }
    } else {
      const cmd = msg.command.split('/').filter((value) => value !== '');
      const parameter: OscParameter = msg.parameters[0];
      if (
        // Name config messages.
        cmd[2] === 'config' &&
        cmd[3] === 'name' &&
        typeof parameter?.value === 'string'
      ) {
        this.handleConfigMessage(cmd[0], cmd[1], parameter.value, null);
      } else if (
        // Color config messages.
        cmd[2] === 'config' &&
        cmd[3] === 'color' &&
        typeof parameter?.value === 'number'
      ) {
        const color = BehringerX32.colorIntToCode(parameter.value);
        this.handleConfigMessage(cmd[0], cmd[1], null, color);
      } else if (
        // Mute change messages.
        cmd[2] === 'mix' &&
        (cmd[3] === 'st' ||
          cmd[3] === 'mono' ||
          cmd[3] === 'on' ||
          cmd[4] === 'on') &&
        parameter?.type === OscParameterType.INT &&
        typeof parameter.value === 'number'
      ) {
        this.handleMuteMessage(cmd, parameter.value === 0);
      } else if (
        // Level change messages.
        cmd[2] === 'mix' &&
        (cmd[3] === 'fader' ||
          cmd[3] === 'mlevel' ||
          cmd[4] === 'fader' ||
          cmd[4] === 'level') &&
        parameter?.type === OscParameterType.FLOAT &&
        typeof parameter.value === 'number'
      ) {
        this.handleLevelMessage(cmd, parameter.value);
      } else if (
        cmd[0] === 'meters' &&
        msg.parameters[0]?.type === OscParameterType.BLOB &&
        msg.parameters[0].value instanceof Buffer
      ) {
        this.handleMetersMessage(cmd[1], msg.parameters[0].value);
      }
    }
  }

  /**
   * Handle the data received from a config message from the X32.
   *
   * @param type The type part of the identifier, e.g. "ch" or "bus".
   * @param number The number part of the identifier. For the main buses, it contains "m" or "st".
   * @param name The name received in the message or null if unavailable.
   * @param colorCode The color code received in the message or null if unavailable.
   */
  private handleConfigMessage(
    type: string,
    number: string,
    name: string | null,
    colorCode: string | null,
  ) {
    const id = `${type}-${number}`;
    if (BehringerX32.inputs.includes(id)) {
      // Config message targeted an input.
      const actualName = name ?? this.inputNames[id];
      const color =
        colorCode === null
          ? this.inputColors[id]
          : BehringerX32.colorCodeToName(colorCode);

      // If name or color changed, store the changes and fire the callbacks.
      if (
        this.inputNames[id] !== actualName ||
        this.inputColors[id] !== color
      ) {
        this.inputNames[id] = actualName;
        this.inputColors[id] = color;
        this.callbacks.forEach((cb) => cb.onInputChange?.(id));
      }
    } else if (BehringerX32.mixes.includes(id)) {
      // Config message targeted a mix.
      const actualName = name ?? this.mixNames[id];
      const color =
        colorCode === null
          ? this.mixColors[id]
          : BehringerX32.colorCodeToName(colorCode);

      // If name or color changed, store the changes and fire the callbacks.
      if (this.mixNames[id] !== actualName || this.mixColors[id] !== color) {
        this.mixNames[id] = actualName;
        this.mixColors[id] = color;
        this.callbacks.forEach((cb) => cb.onMixChange?.(id));
      }
    }
  }

  /**
   * Handle the data received from a mute message from the X32
   * @param cmd The parts of the OSC address.
   * @param mute The new mute status.
   */
  private handleMuteMessage(cmd: string[], mute: boolean) {
    const id = `${cmd[0]}-${cmd[1]}`;
    if (BehringerX32.inputs.includes(id)) {
      // Mute message targeted an input.
      const mixName = BehringerX32.destinationToMixName(cmd[3]);
      if (mixName !== null && this.inputMutes[mixName][id] !== mute) {
        this.inputMutes[mixName][id] = mute;
        this.callbacks.forEach((cb) => cb.onMuteChange?.(mixName, id));
      }
    } else if (BehringerX32.mixes.includes(id)) {
      // Mute message targeted a mix.
      if (this.mixMutes[id] !== mute) {
        this.mixMutes[id] = mute;
        this.callbacks.forEach((cb) => cb.onMuteChange?.(id, null));
      }
    }
  }

  /**
   * Handle the data received from a level message from the X32
   * @param cmd The parts of the OSC address.
   * @param value The new level.
   */
  private handleLevelMessage(cmd: string[], value: number) {
    const id = `${cmd[0]}-${cmd[1]}`;
    if (BehringerX32.inputs.includes(id)) {
      // Level message targeted an input.
      const mixName = BehringerX32.destinationToMixName(cmd[3]);
      if (mixName !== null && this.inputLevels[mixName][id] !== value) {
        this.inputLevels[mixName][id] = value;
        this.callbacks.forEach((cb) => cb.onLevelChange?.(mixName, id));
      }
    } else if (BehringerX32.mixes.includes(id)) {
      // Level message targeted a mix.
      if (this.mixLevels[id] !== value) {
        this.mixLevels[id] = value;
        this.callbacks.forEach((cb) => cb.onLevelChange?.(id, null));
      }
    }
  }

  /**
   * Handle the data received from a meters message from the X32.
   *
   * @param metersId The identifier of the meters type, i.e. "2" or "13".
   * @param values A blob containing the meters values.
   */
  private handleMetersMessage(metersId: string, values: Buffer) {
    // The blobs contain the meter values in an order that can be mapped to the inputs/mixes as follows.
    // null means that the meter value at this position in the blob doesn't match an input/mix.
    const mappings: Record<string, (string | null)[] | undefined> = {
      // prettier-ignore
      '2': [
        'bus-01', 'bus-02', 'bus-03', 'bus-04', 'bus-05', 'bus-06', 'bus-07', 'bus-08',
        'bus-09', 'bus-10', 'bus-11', 'bus-12', 'bus-13', 'bus-14', 'bus-15', 'bus-16',
        null, null, null, null, null, null, 'main-st', 'main-m',
      ],
      // prettier-ignore
      '13': [
        'ch-01', 'ch-02', 'ch-03', 'ch-04', 'ch-05', 'ch-06', 'ch-07', 'ch-08',
        'ch-09', 'ch-10', 'ch-11', 'ch-12', 'ch-13', 'ch-14', 'ch-15', 'ch-16',
        'ch-17', 'ch-18', 'ch-19', 'ch-20', 'ch-21', 'ch-22', 'ch-23', 'ch-24',
        'ch-25', 'ch-26', 'ch-27', 'ch-28', 'ch-29', 'ch-30', 'ch-31', 'ch-32',
        'auxin-01', 'auxin-02', 'auxin-03', 'auxin-04', 'auxin-05', 'auxin-06', 'auxin-07', 'auxin-08',
        'fxrtn-01', 'fxrtn-02', 'fxrtn-03', 'fxrtn-04', 'fxrtn-05', 'fxrtn-06', 'fxrtn-07', 'fxrtn-08',
      ],
    };

    // Select the correct mapping or abort if no such mapping exists.
    const mapping = mappings[metersId];
    if (mapping === undefined) {
      return;
    }

    // Read the values in groups of 4 bytes.
    // The values are stored as LE 32bit floats.
    // The first 4 bytes can be ignored, as they only contain the number of float values that follow.
    let offset = 0;
    mapping.forEach((currentMappingValue) => {
      offset += 4;
      if (currentMappingValue === 'main-st') {
        // main-st needs a special handling, as it actually has two values associated, one for left and one for right.
        // The average of both values is used here.
        this.meters[currentMappingValue] = BehringerX32.getNumberOfLEDs(
          (values.readFloatLE(offset) + values.readFloatLE(offset + 4)) / 2,
        );
        offset += 4;
      } else if (currentMappingValue !== null) {
        this.meters[currentMappingValue] = BehringerX32.getNumberOfLEDs(
          values.readFloatLE(offset),
        );
      }
    });

    // Call the callbacks only after meters13 to avoid duplicate callback calls.
    if (metersId === '13') {
      this.callbacks.forEach((cb) => cb.onMetersChange?.());
    }
  }
}

export default BehringerX32;
