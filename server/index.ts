// Custom Server for next.js
// Based on https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c

import express, { Request, Response } from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();
    server.all('*', (req: Request, res: Response) => handle(req, res));
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(
        `> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`,
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
