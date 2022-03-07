import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import ApiCode from '../common/apiCode';
import useLogin from './useLogin';

/**
 * This hook handles the connection to a WebSocket endpoint.
 * It also handles authentication and provides the last received message and a function to send messages.
 * In case of errors, it will try to reconnect.
 */
function useAuthenticatedWebSocket(path: string) {
  // Detect unmounting as this is the only occasion where the WebSocket is intentionally closed.
  // See https://github.com/robtaussig/react-use-websocket#reconnecting
  const didUnmount = useRef(false);

  // Will ultimately resolve to the URL of the WebSocket endpoint.
  // Can't be given directly, because the URL can only be calculated on the client and not during SSR.
  const [url, setUrl] = useState(() => () => new Promise<string>(() => {}));

  // Get the password currently stored on the client side (for authentication)
  // and a reference to the logout in case a DEAUTH message is received.
  const { password, logout } = useLogin();

  // Assemble the full URL of the WebSocket endpoint once the hook is executed on the client side.
  useEffect(() => {
    const { protocol, host } = window.location;
    setUrl(
      () => () =>
        Promise.resolve(
          `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}/api/${path}`,
        ),
    );
  }, [path]);

  // Open the WebSocket connection by using the useWebSocket hook.
  const { lastMessage, sendMessage } = useWebSocket(url, {
    // Should always reconnect, except when the connection was intentionally closed.
    shouldReconnect: () => !didUnmount.current,

    // Authenticate as soon as the connection is opened.
    // Will also be executed after reconnecting.
    onOpen: () => sendMessage(`${ApiCode.AUTH}${password}`),

    // Try to reconnect nearly indefinitely.
    reconnectAttempts: 999999,
  });

  // Logout if a DEAUTH message is received.
  useEffect(() => {
    if (lastMessage?.data?.startsWith(ApiCode.DEAUTH)) {
      logout();
    }
  }, [lastMessage, logout]);

  // Make the last message and the sendMessage function available for further use.
  return { lastMessage, sendMessage };
}

export default useAuthenticatedWebSocket;
