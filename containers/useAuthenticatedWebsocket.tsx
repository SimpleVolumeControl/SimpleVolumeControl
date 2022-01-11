import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useRecoilState } from 'recoil';
import { passwordState } from './sessionProvider';
import { useRouter } from 'next/router';
import ApiCode from '../common/apiCode';

function useAuthenticatedWebsocket(path: string) {
  const didUnmount = useRef(false);
  const [url, setUrl] = useState(() => () => new Promise<string>(() => {}));
  const [password, setPassword] = useRecoilState(passwordState);
  const router = useRouter();
  useEffect(() => {
    const { protocol, host } = window.location;
    setUrl(
      () => () =>
        Promise.resolve(
          `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}/api/${path}`,
        ),
    );
  }, [path]);
  const { lastMessage, sendMessage } = useWebSocket(url, {
    shouldReconnect: () => !didUnmount.current,
    reconnectAttempts: 999999,
  });
  useEffect(() => {
    if (password !== null) {
      sendMessage(`${ApiCode.AUTH}${password}`);
    }
  }, [sendMessage, password]);
  useEffect(() => {
    if (lastMessage?.data?.startsWith(ApiCode.DEAUTH)) {
      setPassword('');
      router.push('/login').then();
    }
  }, [lastMessage, router, setPassword]);
  return { lastMessage, sendMessage };
}

export default useAuthenticatedWebsocket;
