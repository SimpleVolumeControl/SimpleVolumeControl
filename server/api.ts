import { Router } from 'express';
import App from '../model/app';
import { handleAuth } from './handleAuth';
import { WebSocket } from 'ws';
import MixerUpdateCallbacks from '../model/mixerUpdateCallbacks';

export interface ExtendedWebsocket extends WebSocket {
  authenticated?: boolean;
}

const router = Router();

router.ws('/mixes', (ws, req) => {
  ws.send(`MIXES:${JSON.stringify(App.getInstance().getMixes())}`);
  ws.on('message', (msg: string) => {
    console.log(msg); // TODO Remove
    if (!handleAuth(msg, ws)) {
      return;
    }
    console.log('authenticated'); // TODO Remove
  });
  const callbacks: MixerUpdateCallbacks = {
    onMixChange: (mix: string) => {
      ws.send(`MIXES:${JSON.stringify(App.getInstance().getMixes())}`);
    },
  };
  App.getInstance().registerListeners(callbacks);
  ws.on('close', () => App.getInstance().unregisterListeners(callbacks));
});

export default router;
