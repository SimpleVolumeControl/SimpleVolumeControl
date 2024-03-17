FROM node:iron-alpine as base

RUN npm install -g pnpm

FROM base as build
WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm install --frozen-lockfile
RUN pnpm build:next
RUN pnpm build:server

FROM base as run
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml

ENV NEXT_TELEMETRY_DISABLED 1
ENV CONFIG_DIR /config
ENV NODE_ENV production

RUN pnpm install --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]
