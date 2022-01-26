import { useEffect, useState } from 'react';
import splitMessage from '../common/apiSplitMessage';
import ApiCode from '../common/apiCode';
import { tryJsonParse, isArray, isRecord } from '../utils/helpers';
import MixData, { isMixData } from '../model/mixData';
import InputData, { isInputData } from '../model/inputData';
import { atom, useSetRecoilState } from 'recoil';

export const metersState = atom<string>({
  key: 'metersState',
  default: '',
});

function useMix(message: unknown) {
  const [inputs, setInputs] = useState<InputData[]>([]);
  const [mix, setMix] = useState<MixData | null>(null);
  const setMeters = useSetRecoilState(metersState);

  useEffect(() => {
    if (typeof message !== 'string') {
      return;
    }
    const { code, content } = splitMessage(message);
    if (code === ApiCode.INPUTS) {
      const data = tryJsonParse(content, null);
      if (!isRecord(data) || !isArray(data.inputs) || !isMixData(data.mix)) {
        return;
      }
      setInputs(data.inputs?.filter(isInputData));
      setMix(data.mix);
    } else if (code === ApiCode.MUTE) {
      const [id, value] = content.split('/');
      if (id === '') {
        setMix((old) =>
          old === null ? null : { ...old, mute: value === 'true' },
        );
      } else {
        setInputs((old) =>
          old.map((inputData) =>
            inputData.id === id
              ? { ...inputData, mute: value === 'true' }
              : inputData,
          ),
        );
      }
    } else if (code === ApiCode.LEVEL) {
      const [id, value] = content.split('/');
      if (id === '') {
        setMix((old) =>
          old === null ? null : { ...old, level: parseFloat(value) },
        );
      } else {
        setInputs((old) =>
          old.map((inputData) =>
            inputData.id === id
              ? { ...inputData, level: parseFloat(value) }
              : inputData,
          ),
        );
      }
    } else if (code === ApiCode.METERS) {
      setMeters(content);
    }
  }, [message, setMeters]);
  return { inputs, mix };
}

export default useMix;
