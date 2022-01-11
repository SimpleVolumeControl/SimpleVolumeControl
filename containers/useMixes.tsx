import { useEffect, useState } from 'react';
import splitMessage from '../common/apiSplitMessage';
import ApiCode from '../common/apiCode';
import { tryJsonParse, isArray } from '../utils/helpers';
import MixData, { isMixData } from '../model/mixData';

function useMixes(message: unknown) {
  const [mixes, setMixes] = useState<MixData[]>([]);
  useEffect(() => {
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
  }, [message]);
  return mixes;
}

export default useMixes;
