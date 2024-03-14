FROM node:iron-alpine as base

FROM base as build
WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn install --frozen-lockfile
RUN yarn run build:next
RUN yarn run build:server

FROM base as run
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

ENV NEXT_TELEMETRY_DISABLED 1
ENV CONFIG_DIR /config

EXPOSE 3000

CMD ["yarn", "start"]
