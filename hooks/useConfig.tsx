import { useEffect, useState } from 'react';
import splitMessage from '../common/apiSplitMessage';
import ApiCode from '../common/apiCode';
import { tryJsonParse } from '../utils/helpers';
import useAuthenticatedWebSocket from './useAuthenticatedWebSocket';
import NullableConfig, { isNullableConfig } from '../model/nullableConfig';

/**
 * This hook handles the connection to the /config WebSocket API endpoint.
 * It handles all API message belonging to this endpoint and
 * provides the current configuration.
 */
function useConfig() {
  // Get the last message from the authenticated WebSocket hook.
  const { lastMessage, sendMessage } = useAuthenticatedWebSocket('config');

  // Store the data of the mixes in a state.
  const [config, setConfig] = useState<NullableConfig>({
    ip: null,
    mixer: null,
    mixes: null,
    password: null,
  });

  // Function to send config changes back to the server.
  const [changeConfig, setChangeConfig] = useState<
    (config: NullableConfig) => void
  >(() => () => {});

  // Define the sendMute and sendLevel functions in dependency of the basic sendMessage function.
  useEffect(() => {
    setChangeConfig(
      () => (config: NullableConfig) =>
        sendMessage(`${ApiCode.CONFIG}${JSON.stringify(config)}`),
    );
  }, [sendMessage]);

  // Handle the incoming API messages.
  useEffect(() => {
    // Get access to the actual message data.
    const message = lastMessage?.data;

    // Ignore invalid messages.
    if (typeof message !== 'string') {
      return;
    }

    // Separate the API code from the actual content of the message.
    const { code, content } = splitMessage(message);

    // Only handle MIXES messages, as those are the only ones allowed for this endpoint.
    if (code !== ApiCode.CONFIG) {
      return;
    }

    // Try to parse the payload data and ignore it if it is invalid.
    const data = tryJsonParse(content, null);
    if (!isNullableConfig(data)) {
      return;
    }

    // Store the data.
    setConfig(data);
  }, [lastMessage]);

  // Make the data of the mixes available for use in a component.
  return { config, changeConfig };
}

export default useConfig;
