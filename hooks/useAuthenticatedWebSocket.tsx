import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useRouter } from 'next/router';
import ApiCode from '../common/apiCode';
import useLogin from './useLogin';

function useAuthenticatedWebSocket(path: string) {
  const didUnmount = useRef(false);
  const [url, setUrl] = useState(() => () => new Promise<string>(() => {}));
  const { password } = useLogin();
  const { logout } = useLogin();
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
    onOpen: () => {
      sendMessage(`${ApiCode.AUTH}${password}`);
    },
    reconnectAttempts: 999999,
  });
  useEffect(() => {
    if (lastMessage?.data?.startsWith(ApiCode.DEAUTH)) {
      logout();
    }
  }, [lastMessage, router, logout]);
  return { lastMessage, sendMessage };
}

export default useAuthenticatedWebSocket;
