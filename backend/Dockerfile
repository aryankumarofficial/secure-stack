FROM oven/bun:1.3-alpine AS deps

WORKDIR /app

RUN apk add --no-cache python3 make g++ gcc libc-dev

COPY package.json bun.lock ./
COPY prisma.config.ts ./
COPY prisma ./prisma

ARG DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV DATABASE_URL=$DATABASE_URL


RUN bun install --frozen-lockfile

FROM deps AS builder
WORKDIR /app

COPY . .

RUN bun run generate-swagger

RUN bun run build

FROM oven/bun:1.3-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/dist           ./dist
COPY --from=builder /app/.generated     ./.generated
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/package.json   ./


EXPOSE 5000

CMD [ "bun","run","start" ]
