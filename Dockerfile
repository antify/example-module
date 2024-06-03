# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.14.2

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

ENV NODE_ENV=production

RUN npm i -g pnpm

WORKDIR /app

# Build
FROM base as build

COPY --link package.json pnpm-lock.yaml .
RUN pnpm i --production=false --frozen-lockfile

COPY --link . .

RUN pnpm dev:prepare && pnpm dev:build
# RUN pnpm prune

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/database.config.ts /app/database.config.ts
COPY --from=build /app/src/runtime/server/datasources/db /app/src/runtime/server/datasources/db
COPY --from=build /app/playground/.output /app/playground/.output
COPY --from=build /app/playground/.output /app/playground/.output
COPY --from=build /app/node_modules /app/node_modules

CMD [ "node", "playground/.output/server/index.mjs" ]
