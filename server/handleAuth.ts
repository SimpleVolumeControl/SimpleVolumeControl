import App from '../model/app';
import { WebSocket } from 'ws';
import { ExtendedWebsocket } from './api';

export const AUTH = 'AUTH:';
export const DEAUTH = 'DEAUTH:';

export function handleAuth(msg: string, ws: WebSocket): boolean {
  const extWs = ws as ExtendedWebsocket;
  if (msg.startsWith(AUTH)) {
    if (msg.slice(AUTH.length) === App.getInstance().getPasswordHash()) {
      extWs.authenticated = true;
    } else {
      ws.send(`${DEAUTH}:Invalid password.`);
    }
  }
  return extWs.authenticated ?? false;
}
