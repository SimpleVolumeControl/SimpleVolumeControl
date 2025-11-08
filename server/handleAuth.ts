import App from '../model/app';
import { WebSocket } from 'ws';
import ApiCode from '../common/apiCode';
import splitMessage from '../common/apiSplitMessage';

// Declare that there can be an `authenticated` field on the WebSocket objects.
interface ExtendedWebsocket extends WebSocket {
  authenticated?: boolean;
}

/**
 * Handle the AUTH messages of the API.
 * Checks if the supplied password hash is correct and mark the connection as authenticated.
 * If the message is no AUTH message, it remains untouched so that it can be handled further down the line.
 *
 * @param msg A received API message.
 * @param ws The WebSocket connection in which the message was received.
 *
 * @return True if the connection is authenticated.
 */
export function handleAuth(msg: string, ws: WebSocket): boolean {
  const extWs = ws as ExtendedWebsocket;
  const { code, content } = splitMessage(msg);

  // Only handle auth messages.
  if (code === ApiCode.AUTH) {
    if (App.getInstance().checkPassword(content)) {
      // If the supplied hash is correct, mark the connection as authenticated.
      extWs.authenticated = true;
    } else {
      // Otherwise, tell the client that the password was invalid, and they should probably try another password.
      ws.send(`${ApiCode.DEAUTH}Invalid password.`);
    }
  }

  // Indicate, if the connection is authenticated.
  return extWs.authenticated ?? false;
}
