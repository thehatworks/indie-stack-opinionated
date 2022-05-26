import fs from "fs";
import path from "path";
import process, { argv } from "process";

import morgan from "morgan";
import express from "express";
import compression from "compression";
import type { Request, Response } from "express";

import { createRequestHandler } from "@remix-run/express";

const BUILD_DIR = path.resolve(path.join(__dirname, "..", "build"));

const purge_require_cache = () => {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. Remix project suggests & prefers the DX of this solution
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
};

const main = () => {
  if (!fs.existsSync(BUILD_DIR)) {
    console.warn(
      "Build directory doesn't exist, please run `npm run dev` or `npm run build` before starting the server."
    );
  }

  const app = express();

  app.use(compression());

  // recommended better security for express
  if (process.env.NODE_ENV === "production") {
    app.disable("x-powered-by");
  }

  // Everything else (like favicon.ico)
  // is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static("public", { maxAge: "1h" }));

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
  );

  app.use(morgan("tiny"));

  app.all(
    "*",
    process.env.NODE_ENV === "development"
      ? (req: Request, res: Response, next: () => void) => {
          purge_require_cache();

          return createRequestHandler({
            build: require(BUILD_DIR),
            mode: process.env.NODE_ENV,
          })(req, res, next);
        }
      : createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })
  );

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.listen(port, () => {
    const listening_string =
      port === 3000 ? `at http://localhost:${port}` : `on port ${port}`;

    console.log(`🚄 Server listening ${listening_string}`);
  });
};

if (argv[1] === __filename) {
  main();
}
