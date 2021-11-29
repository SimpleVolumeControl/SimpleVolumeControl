import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useRecoilValue } from 'recoil';
import { passwordState } from './sessionProvider';
import { useRouter } from 'next/router';

function useAuthenticatedWebsocket(path: string) {
  const didUnmount = useRef(false);
  const [url, setUrl] = useState(() => () => new Promise<string>(() => {}));
  const password = useRecoilValue(passwordState);
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
      sendMessage(`AUTH:${password}`);
    }
  }, [sendMessage, password]);
  useEffect(() => {
    if (lastMessage?.data?.startsWith('DEAUTH:')) {
      router.push('/login').then();
    }
  }, [lastMessage, router]);
  return { lastMessage, sendMessage };
}

export default useAuthenticatedWebsocket;
