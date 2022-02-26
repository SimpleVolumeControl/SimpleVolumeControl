import { Router } from 'express';
import App from '../model/app';
import { handleAuth } from './handleAuth';
import { WebSocket } from 'ws';
import MixerUpdateCallbacks from '../model/mixerUpdateCallbacks';
import ApiCode from '../common/apiCode';
import splitMessage from '../common/apiSplitMessage';

export interface ExtendedWebsocket extends WebSocket {
  authenticated?: boolean;
}

const router = Router();

router.ws('/mixes', (ws) => {
  ws.send(`${ApiCode.MIXES}${JSON.stringify(App.getInstance().getMixes())}`);
  ws.on('message', (msg: string) => {
    if (!handleAuth(msg, ws)) {
      return;
    }
  });
  const callbacks: MixerUpdateCallbacks = {
    onMixChange: (mix: string) => {
      if (App.getInstance().getConfiguredMixIds().includes(mix)) {
        const data = JSON.stringify(App.getInstance().getMixes());
        ws.send(`${ApiCode.MIXES}${data}`);
      }
    },
  };
  App.getInstance().registerListeners(callbacks);
  ws.on('close', () => App.getInstance().unregisterListeners(callbacks));
});

router.ws('/mix/:mixId', (ws, req) => {
  const mixId = req.params.mixId;
  const sendAll = () => {
    ws.send(
      `${ApiCode.MIX}${JSON.stringify({
        inputs: App.getInstance().getInputs(mixId),
        mix: App.getInstance().getMix(mixId),
      })}`,
    );
  };
  sendAll();
  ws.on('message', (msg: string) => {
    if (!handleAuth(msg, ws)) {
      return;
    }
    const { code, content } = splitMessage(msg);
    if (code === ApiCode.MUTE) {
      const [id, value] = content.split('/');
      if (id === '') {
        App.getInstance().setMute(value === 'true', mixId, null);
      } else {
        App.getInstance().setMute(value === 'true', mixId, id);
      }
    } else if (code === ApiCode.LEVEL) {
      const [id, value] = content.split('/');
      if (id === '') {
        App.getInstance().setLevel(parseFloat(value), mixId, null);
      } else {
        App.getInstance().setLevel(parseFloat(value), mixId, id);
      }
    }
  });
  const callbacks: MixerUpdateCallbacks = {
    onMixChange: (mix: string) => {
      if (mix === mixId) {
        sendAll();
      }
    },
    onInputChange: (input) => {
      if (App.getInstance().getConfiguredInputIds(mixId).includes(input)) {
        sendAll();
      }
    },
    onLevelChange: (mix, input) => {
      const app = App.getInstance();
      if (mix === mixId) {
        if (input === null) {
          ws.send(`${ApiCode.LEVEL}/${app.getMix(mix)?.level ?? 0}`);
        } else if (app.getConfiguredInputIds(mixId).includes(input)) {
          ws.send(
            `${ApiCode.LEVEL}${input}/${app.getInput(mix, input)?.level ?? 0}`,
          );
        }
      }
    },
    onMuteChange: (mix, input) => {
      const app = App.getInstance();
      if (mix === mixId) {
        if (input === null) {
          ws.send(`${ApiCode.MUTE}/${app.getMix(mix)?.mute ?? true}`);
        } else if (app.getConfiguredInputIds(mixId).includes(input)) {
          ws.send(
            `${ApiCode.MUTE}${input}/${app.getInput(mix, input)?.mute ?? true}`,
          );
        }
      }
    },
    onMetersChange: () => {
      const app = App.getInstance();
      ws.send(
        `${ApiCode.METERS}${app.getMetersString([
          mixId,
          ...app.getConfiguredInputIds(mixId),
        ])}`,
      );
    },
  };
  App.getInstance().registerListeners(callbacks);
  ws.on('close', () => App.getInstance().unregisterListeners(callbacks));
});

export default router;
