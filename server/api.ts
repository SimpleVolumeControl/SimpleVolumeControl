import { Router } from 'express';
import App from '../model/app';

const router = Router();

router.ws('/mixes', (ws, req) => {
  ws.send(JSON.stringify(App.getInstance().getMixes()));
  ws.on('message', (msg: string) => {
    ws.send(msg.toUpperCase()); // TODO Remove
  });
});

export default router;
