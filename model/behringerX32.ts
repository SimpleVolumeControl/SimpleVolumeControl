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

interface QueuedMessageWithCloseFunction {
  msg: Buffer;
  close?: (connection: Socket) => void;
}

type QueuedMessage = QueuedMessageWithCloseFunction | Buffer;

class BehringerX32 extends Mixer {
  static readonly mixerName = 'Behringer X32';
  static readonly inputs = mixers[BehringerX32.mixerName]?.inputs ?? [];
  static readonly mixes = mixers[BehringerX32.mixerName]?.mixes ?? [];
  // prettier-ignore
  static readonly sendsTargets = [
    'st', 'fader', 'mono', 'mlevel',
    '01/on', '01/level', '02/on', '02/level', '03/on', '03/level', '04/on', '04/level',
    '05/on', '05/level', '06/on', '06/level', '07/on', '07/level', '08/on', '08/level',
    '09/on', '09/level', '10/on', '10/level', '11/on', '11/level', '12/on', '12/level',
    '13/on', '13/level', '14/on', '14/level', '15/on', '15/level', '16/on', '16/level',
  ]

  private readonly CMD_INTERVAL = 2;
  private readonly XREMOTE_INTERVAL = 8_000;
  private readonly QUERY_INTERVAL = 250;
  private readonly PORT = 10023;
  private readonly UDP_TIMEOUT = 10_000;

  private readonly queue = new Queue<QueuedMessage>(this.CMD_INTERVAL);
  private readonly queryIterator: Generator<Buffer>;
  private readonly queryBuffers: Buffer[];

  private xremoteConnection: Socket | null = null;
  private xremoteInterval: NodeJS.Timer | null = null;
  private queryInterval: NodeJS.Timer | null = null;

  private mixNames: Record<string, string> = {};
  private mixColors: Record<string, string> = {};
  private mixMutes: Record<string, boolean> = {};
  private mixLevels: Record<string, number> = {};
  private inputNames: Record<string, string> = {};
  private inputColors: Record<string, string> = {};
  private inputMutes: Record<string, Record<string, boolean>> = {};
  private inputLevels: Record<string, Record<string, number>> = {};

  private callbacks: MixerUpdateCallbacks[] = [];

  constructor(ip: string) {
    super(ip);
    BehringerX32.mixes.forEach((mixId) => {
      this.inputMutes[mixId] = {};
      this.inputLevels[mixId] = {};
    });
    this.queue.addHandler((val) => this.sendCommand(val));
    this.queryBuffers = [
      ...BehringerX32.mixes.flatMap((mixId) => [
        new OscMessage('/node', `${mixId.replace('-', '/')}/config`).toBuffer(),
        new OscMessage(`/${mixId.replace('-', '/')}/mix/on`).toBuffer(),
        new OscMessage(`/${mixId.replace('-', '/')}/mix/level`).toBuffer(),
      ]),
      ...BehringerX32.inputs.flatMap((inputId) => [
        new OscMessage(
          '/node',
          `${inputId.replace('-', '/')}/config`,
        ).toBuffer(),
        ...BehringerX32.sendsTargets.map((target) =>
          new OscMessage(
            `/${inputId.replace('-', '/')}/mix/${target}`,
          ).toBuffer(),
        ),
      ]),
    ];
    this.queryIterator = perpetuallyIterateOverArray(this.queryBuffers);
    this.startListening();
  }

  setIp(ip: string) {
    super.setIp(ip);
    this.stopListening();
    this.startListening();
  }

  stop() {
    this.stopListening();
  }

  getInputData(mixId: string, inputId: string): InputData {
    return {
      id: inputId,
      name: this.inputNames[inputId] ?? inputId.toUpperCase(),
      color: this.inputColors[inputId] ?? 'white',
      level: 0,
      mute: true,
    };
  }

  getMixData(id: string): MixData {
    return {
      id: id,
      name: this.mixNames[id] ?? id.toUpperCase(),
      color: this.mixColors[id] ?? 'white',
      level: 0,
      mute: true,
    };
  }

  registerListeners(callbacks: MixerUpdateCallbacks): void {
    this.callbacks.push(callbacks);
  }

  unregisterListeners(callbacks: MixerUpdateCallbacks): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callbacks);
  }

  getMixerName(): string {
    return BehringerX32.mixerName;
  }

  private startListening() {
    const xremote: QueuedMessage = {
      msg: new OscMessage('/xremote').toBuffer(),
      close: (connection: Socket) => {
        this.xremoteConnection?.close();
        this.xremoteConnection = connection;
      },
    };

    this.queue.queueValue(xremote);
    this.xremoteInterval = setInterval(
      () => this.queue.queueValue(xremote),
      this.XREMOTE_INTERVAL,
    );
    this.xremoteInterval.unref();
    this.queryBuffers.forEach((buffer) => this.queue.queueValue(buffer));
    this.queryInterval = setInterval(
      () => this.queue.queueValue(this.queryIterator.next().value),
      this.QUERY_INTERVAL,
    );
    this.queryInterval.unref();
  }

  private stopListening() {
    if (this.xremoteInterval !== null) {
      clearInterval(this.xremoteInterval);
      this.xremoteInterval = null;
    }
    this.xremoteConnection?.close();
    this.xremoteConnection = null;
    if (this.queryInterval !== null) {
      clearInterval(this.queryInterval);
      this.queryInterval = null;
    }
  }

  private sendCommand(queuedMessage: QueuedMessage) {
    const msg = 'msg' in queuedMessage ? queuedMessage.msg : queuedMessage;
    const connection = dgram.createSocket('udp4');
    connection.on('message', (msg) => {
      this.handleMixerResponse(msg);
      if (!('close' in queuedMessage && queuedMessage.close)) {
        connection.close();
      }
    });
    setTimeout(() => {
      try {
        connection.close();
      } catch (e) {}
    }, this.UDP_TIMEOUT).unref();
    connection.send(msg, 0, msg.length, this.PORT, this.ip);
    if ('close' in queuedMessage) {
      queuedMessage.close?.(connection);
    }
  }

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

  private static colorIntToCode(color: number): string {
    // prettier-ignore
    return (
      [
        'OFF', 'RD', 'GN', 'YE', 'BL', 'MG', 'CY', 'WH',
        'OFFi', 'RDi', 'GNi', 'YEi', 'BLi', 'MGi', 'CYi', 'WHi',
      ][color] ?? 'OFF'
    );
  }

  private static destinationToMixName(destination: string): string {
    switch (destination) {
      case 'st':
      case 'fader':
        return 'main-st';
      case 'mono':
      case 'mlevel':
        return 'main-m';
      default:
        return `bus-${destination.substring(0, 2)}`;
    }
  }

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

  private handleMixerResponse(buffer: Buffer) {
    const msg = OscMessage.fromBuffer(buffer);
    if (
      msg.command === 'node' &&
      msg.parameters.length === 1 &&
      typeof msg.parameters[0].value === 'string'
    ) {
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
        // Name config messages
        cmd[2] === 'config' &&
        cmd[3] === 'name' &&
        typeof parameter?.value === 'string'
      ) {
        this.handleConfigMessage(cmd[0], cmd[1], parameter.value, null);
      } else if (
        cmd[2] === 'config' &&
        cmd[3] === 'color' &&
        typeof parameter?.value === 'number'
      ) {
        // Color config messages
        const color = BehringerX32.colorIntToCode(parameter.value);
        this.handleConfigMessage(cmd[0], cmd[1], null, color);
      } else if (
        // Mute change messages
        cmd[2] === 'mix' &&
        parameter?.type === OscParameterType.INT &&
        typeof parameter.value === 'number'
      ) {
        this.handleMuteMessage(cmd, parameter.value === 0);
      } else if (
        // Level change messages
        cmd[2] === 'mix' &&
        parameter?.type === OscParameterType.FLOAT &&
        typeof parameter.value === 'number'
      ) {
        this.handleLevelMessage(cmd, parameter.value);
      }
    }
  }

  private handleConfigMessage(
    type: string,
    number: string,
    name: string | null,
    colorCode: string | null,
  ) {
    const id = `${type}-${number}`;
    if (BehringerX32.inputs.includes(id)) {
      const actualName = name ?? this.inputNames[id];
      const color =
        colorCode === null
          ? this.inputColors[id]
          : BehringerX32.colorCodeToName(colorCode);
      if (
        this.inputNames[id] !== actualName ||
        this.inputColors[id] !== color
      ) {
        this.inputNames[id] = actualName;
        this.inputColors[id] = color;
        this.callbacks.forEach((cb) => cb.onInputChange?.(id));
      }
    } else if (BehringerX32.mixes.includes(id)) {
      const actualName = name ?? this.mixNames[id];
      const color =
        colorCode === null
          ? this.mixColors[id]
          : BehringerX32.colorCodeToName(colorCode);
      if (this.mixNames[id] !== actualName || this.mixColors[id] !== color) {
        this.mixNames[id] = actualName;
        this.mixColors[id] = color;
        this.callbacks.forEach((cb) => cb.onMixChange?.(id));
      }
    }
  }

  private handleMuteMessage(cmd: string[], mute: boolean) {
    const id = `${cmd[0]}-${cmd[1]}`;
    if (BehringerX32.inputs.includes(id)) {
      const mixName = BehringerX32.destinationToMixName(cmd[3]);
      if (this.inputMutes[mixName][id] !== mute) {
        this.inputMutes[mixName][id] = mute;
        this.callbacks.forEach((cb) => cb.onMuteChange?.(mixName, id));
      }
    } else if (BehringerX32.mixes.includes(id)) {
      if (this.mixMutes[id] !== mute) {
        this.mixMutes[id] = mute;
        this.callbacks.forEach((cb) => cb.onMuteChange?.(id, null));
      }
    }
  }

  private handleLevelMessage(cmd: string[], value: number) {
    const id = `${cmd[0]}-${cmd[1]}`;
    if (BehringerX32.inputs.includes(id)) {
      const mixName = BehringerX32.destinationToMixName(cmd[3]);
      if (this.inputLevels[mixName][id] !== value) {
        this.inputLevels[mixName][id] = value;
        this.callbacks.forEach((cb) => cb.onLevelChange?.(mixName, id));
      }
    } else if (BehringerX32.mixes.includes(id)) {
      if (this.mixLevels[id] !== value) {
        this.mixLevels[id] = value;
        this.callbacks.forEach((cb) => cb.onLevelChange?.(id, null));
      }
    }
  }
}

export default BehringerX32;
