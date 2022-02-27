import { useEffect, useState } from 'react';
import splitMessage from '../common/apiSplitMessage';
import ApiCode from '../common/apiCode';
import { tryJsonParse, isArray, isRecord } from '../utils/helpers';
import MixData, { isMixData } from '../model/mixData';
import InputData, { isInputData } from '../model/inputData';
import { atom, useSetRecoilState } from 'recoil';
import useAuthenticatedWebSocket from './useAuthenticatedWebSocket';

export const metersState = atom<string>({
  key: 'metersState',
  default: '',
});

function useMix(id: string) {
  const { lastMessage, sendMessage } = useAuthenticatedWebSocket(`mix/${id}`);
  const [inputs, setInputs] = useState<InputData[]>([]);
  const [mix, setMix] = useState<MixData | null>(null);
  const [sendMute, setSendMute] = useState<
    (id: string, value: boolean) => void
  >(() => () => {});
  const [sendLevel, setSendLevel] = useState<
    (id: string, value: number) => void
  >(() => () => {});

  const setMeters = useSetRecoilState(metersState);

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

  useEffect(() => {
    const message = lastMessage?.data;
    if (typeof message !== 'string') {
      return;
    }
    const { code, content } = splitMessage(message);
    if (code === ApiCode.MIX) {
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
  }, [lastMessage, setMeters]);
  return { inputs, mix, sendLevel, sendMute };
}

export default useMix;
