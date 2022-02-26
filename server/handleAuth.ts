import App from '../model/app';
import { WebSocket } from 'ws';
import { ExtendedWebsocket } from './api';
import ApiCode from '../common/apiCode';
import splitMessage from '../common/apiSplitMessage';

export function handleAuth(msg: string, ws: WebSocket): boolean {
  const extWs = ws as ExtendedWebsocket;
  const { code, content } = splitMessage(msg);
  if (code === ApiCode.AUTH) {
    if (App.getInstance().checkPassword(content)) {
      extWs.authenticated = true;
    } else {
      ws.send(`${ApiCode.DEAUTH}Invalid password.`);
    }
  }
  return extWs.authenticated ?? false;
}
