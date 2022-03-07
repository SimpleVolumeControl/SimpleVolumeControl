import { useEffect, useState } from 'react';
import splitMessage from '../common/apiSplitMessage';
import ApiCode from '../common/apiCode';
import { tryJsonParse, isArray } from '../utils/helpers';
import MixData, { isMixData } from '../model/mixData';
import useAuthenticatedWebSocket from './useAuthenticatedWebSocket';

/**
 * This hook handles the connection to the /mixes WebSocket API endpoint.
 * It handles all API message belonging to this endpoint and
 * provides the data of all configured mixes.
 */
function useMixes() {
  // Get the last message from the authenticated WebSocket hook.
  const { lastMessage } = useAuthenticatedWebSocket('mixes');

  // Store the data of the mixes in a state.
  const [mixes, setMixes] = useState<MixData[]>([]);

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
    if (code !== ApiCode.MIXES) {
      return;
    }

    // Try to parse the payload data and ignore it if it is invalid.
    const data = tryJsonParse(content, null);
    if (!isArray(data)) {
      return;
    }

    // Store the data.
    setMixes(data.filter(isMixData));
  }, [lastMessage]);

  // Make the data of the mixes available for use in a component.
  return mixes;
}

export default useMixes;
