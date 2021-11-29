import { Router } from 'express';
import App from '../model/app';
import { handleAuth } from './handleAuth';
import { WebSocket } from 'ws';

export interface ExtendedWebsocket extends WebSocket {
  authenticated?: boolean;
}

const router = Router();

router.ws('/mixes', (ws, req) => {
  ws.send(JSON.stringify(App.getInstance().getMixes()));
  ws.on('message', (msg: string) => {
    console.log(msg); // TODO Remove
    if (!handleAuth(msg, ws)) {
      return;
    }
    console.log('authenticated'); // TODO Remove
  });
});

export default router;
