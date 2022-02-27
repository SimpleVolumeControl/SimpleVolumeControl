import { useEffect, useState } from 'react';
import splitMessage from '../common/apiSplitMessage';
import ApiCode from '../common/apiCode';
import { tryJsonParse, isArray } from '../utils/helpers';
import MixData, { isMixData } from '../model/mixData';
import useAuthenticatedWebSocket from './useAuthenticatedWebSocket';

function useMixes() {
  const { lastMessage } = useAuthenticatedWebSocket('mixes');
  const [mixes, setMixes] = useState<MixData[]>([]);
  useEffect(() => {
    const message = lastMessage?.data;
    if (typeof message !== 'string') {
      return;
    }
    const { code, content } = splitMessage(message);
    if (code !== ApiCode.MIXES) {
      return;
    }
    const data = tryJsonParse(content, null);
    if (!isArray(data)) {
      return;
    }
    setMixes(data.filter(isMixData));
  }, [lastMessage]);
  return mixes;
}

export default useMixes;
