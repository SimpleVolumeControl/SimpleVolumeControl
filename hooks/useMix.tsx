import { useEffect, useState } from 'react';
import splitMessage from '../common/apiSplitMessage';
import ApiCode from '../common/apiCode';
import { tryJsonParse, isArray, isRecord } from '../utils/helpers';
import MixData, { isMixData } from '../model/mixData';
import InputData, { isInputData } from '../model/inputData';
import useAuthenticatedWebSocket from './useAuthenticatedWebSocket';

/**
 * This hook handles the connection to the /mix WebSocket API endpoint.
 * It handles all API message belonging to this endpoint and
 * provides the data of the mix itself, the data of the configured inputs and the meters values,
 * as well as functions to send changes for the mute and level values back to the server.
 */
function useMix(id: string) {
  // Get the last message and the sendMessage function from the authenticated WebSocket hook.
  const { lastMessage, sendMessage } = useAuthenticatedWebSocket(`mix/${id}`);

  // Store the data of the inputs in a state.
  const [inputs, setInputs] = useState<InputData[]>([]);

  // Store the data of the mix itself in a state.
  const [mix, setMix] = useState<MixData | null>(null);

  // Functions to send mute and level changes back to the server.
  const [sendMute, setSendMute] = useState<
    (id: string, value: boolean) => void
  >(() => () => {});
  const [sendLevel, setSendLevel] = useState<
    (id: string, value: number) => void
  >(() => () => {});

  // Store the meters values in a state.
  const [meters, setMeters] = useState('');

  // Define the sendMute and sendLevel functions in dependency of the basic sendMessage function.
  useEffect(() => {
    setSendMute(
      () => (id: string, value: boolean) =>
        sendMessage(`${ApiCode.MUTE}${id}/${value}`),
    );
    setSendLevel(
      () => (id: string, value: number) =>
        sendMessage(`${ApiCode.LEVEL}${id}/${value}`),
    );
  }, [sendMessage]);

  // Handle all incoming API messages.
  useEffect(() => {
    // Get access to the actual message data.
    const message = lastMessage?.data;

    // Ignore invalid messages.
    if (typeof message !== 'string') {
      return;
    }

    // Separate the API code from the actual content of the message.
    const { code, content } = splitMessage(message);

    if (code === ApiCode.MIX) {
      // Try to parse the payload data and ignore the message if this data is invalid.
      const data = tryJsonParse(content, null);
      if (!isRecord(data) || !isArray(data.inputs) || !isMixData(data.mix)) {
        return;
      }

      // Store the data.
      setInputs(data.inputs?.filter(isInputData));
      setMix(data.mix);
    } else if (code === ApiCode.MUTE) {
      // Separate the input identifier from the value.
      const [id, value] = content.split('/');

      // An empty input identifier means that the mix itself and not an input is affected.
      if (id === '') {
        // Update the mix data.
        setMix((old) =>
          old === null ? null : { ...old, mute: value === 'true' },
        );
      } else {
        // Find the respective input data and update it.
        setInputs((old) =>
          old.map((inputData) =>
            inputData.id === id
              ? { ...inputData, mute: value === 'true' }
              : inputData,
          ),
        );
      }
    } else if (code === ApiCode.LEVEL) {
      // Separate the input identifier from the value.
      const [id, value] = content.split('/');

      // An empty input identifier means that the mix itself and not an input is affected.
      if (id === '') {
        // Update the mix data.
        setMix((old) =>
          old === null ? null : { ...old, level: parseFloat(value) },
        );
      } else {
        // Find the respective input data and update it.
        setInputs((old) =>
          old.map((inputData) =>
            inputData.id === id
              ? { ...inputData, level: parseFloat(value) }
              : inputData,
          ),
        );
      }
    } else if (code === ApiCode.METERS) {
      // Store the meters values.
      // No validation is necessary here, as the functions that handle this data later can deal with malformed data.
      setMeters(content);
    }
  }, [lastMessage]);

  // Make the functions and information available for use in a component.
  return { inputs, mix, meters, sendLevel, sendMute };
}

export default useMix;
