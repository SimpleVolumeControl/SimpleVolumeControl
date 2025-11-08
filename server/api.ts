import { Router } from 'express';
import App from '../model/app';
import { handleAuth } from './handleAuth';
import { WebSocket, WebSocketServer } from 'ws';
import MixerUpdateCallbacks from '../model/mixerUpdateCallbacks';
import ApiCode from '../common/apiCode';
import splitMessage from '../common/apiSplitMessage';
import { tryJsonParse } from '../utils/helpers';
import { isNullableConfig } from '../model/nullableConfig';
import { URLPattern } from 'node:url';

interface WebSocketRoute {
  path: string;
  handler: (ws: WebSocket, match: URLPatternResult) => void;
}

const webSocketRoutes: WebSocketRoute[] = [
  {
    // API endpoint for the mixes overview.
    path: '/api/mixes',
    handler: (ws) => {
      // On opening, send the list of mix data for all configured mixes.
      ws.send(
        `${ApiCode.MIXES}${JSON.stringify(App.getInstance().getMixes())}`,
      );

      // Handle messages initiated by the client.
      ws.on('message', (rawMsg) => {
        const msg = rawMsg.toString();

        // Handle auth messages and discard all other messages when not authenticated.
        if (!handleAuth(msg, ws)) {
          return;
        }
      });

      // Register callbacks so that the mixes data can be re-sent when there are changes to a relevant mix.
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
    },
  },
  {
    // API endpoint for the mix details.
    path: '/api/mix/:mixId',
    handler: (ws, match) => {
      // Get the identifier of the mix.
      const mixId = match.pathname.groups.mixId;
      if (!mixId) {
        ws.close();
        return;
      }

      // Helper function to send the combined mix and input data.
      const sendAll = () => {
        ws.send(
          `${ApiCode.MIX}${JSON.stringify({
            inputs: App.getInstance().getInputs(mixId),
            mix: App.getInstance().getMix(mixId),
          })}`,
        );
      };

      // On opening, send the combined mix and input data.
      sendAll();

      // Handle messages initiated by the client.
      ws.on('message', (rawMsg) => {
        const msg = rawMsg.toString();

        // Handle auth messages and discard all other messages when not authenticated.
        if (!handleAuth(msg, ws)) {
          return;
        }

        // Handle mute and level change messages.
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

      // Register callbacks so that the appropriate data can be re-sent when there are relevant changes.
      const callbacks: MixerUpdateCallbacks = {
        // When there are changes to the mix or the inputs, send the combined mix and input data again.
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

        // When there are mute or level changes, only that the respective data.
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

        // Send the new meters data when available.
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
    },
  },
  {
    // API endpoint for the configuration.
    path: '/api/config',
    handler: (ws) => {
      // On opening, send the current config (excluding the password).
      ws.send(
        `${ApiCode.CONFIG}${App.getInstance().getJsonConfigWithoutPassword()}`,
      );

      // Handle messages initiated by the client.
      ws.on('message', (rawMsg) => {
        const msg = rawMsg.toString();

        // Handle auth messages and discard all other messages when not authenticated.
        if (!handleAuth(msg, ws)) {
          return;
        }

        // Handle config change.
        const { code, content } = splitMessage(msg);
        if (code === ApiCode.CONFIG) {
          const data = tryJsonParse(content, {});
          if (isNullableConfig(data)) {
            App.getInstance().adjustConfig(data);
          }
        }

        // Finally, resend the updated configuration.
        ws.send(
          `${ApiCode.CONFIG}${App.getInstance().getJsonConfigWithoutPassword()}`,
        );
      });
    },
  },
];

const webSocketRoutesWithPatterns = webSocketRoutes.map((route) => ({
  ...route,
  pattern: new URLPattern({ pathname: route.path }),
}));

export const wss = new WebSocketServer({
  noServer: true,
});

wss.on('connection', (ws, req) => {
  const url = new URL(`http://localhost${req.url}`);

  for (const route of webSocketRoutesWithPatterns) {
    const match = route.pattern.exec(url);
    if (match) {
      route.handler(ws, match);
      return;
    }
  }

  // Close connection if no route matches.
  ws.close();
});

// Create a new sub-router for the API routes.
export const apiRouter = Router();

apiRouter.get('/title', (req, res) => {
  res.send(App.getInstance().getTitle());
});
