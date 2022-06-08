# Install all packages and transpile TypeScript into JavaScript
FROM node:18 AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY .yarn .yarn
COPY .yarnrc.yml package.json yarn.lock ./
RUN yarn

COPY codegen.yml esbuild.js pgtyped.config.json tsconfig.json ./
COPY database database
COPY src src
RUN yarn build

# Install only dependency packages
FROM node:18-alpine AS runner

EXPOSE $PORT

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/out out

ENTRYPOINT ["node", "out/index.cjs"]
