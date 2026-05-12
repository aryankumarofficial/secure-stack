FROM oven/bun:1.1-alpine AS deps

WORKDIR /app

RUN apk add --no-cache python3 make g++ gcc libc-dev

COPY package.json bun.lock ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile

FROM deps as builder
WORKDIR /app

COPY . .

RUN bun run build

FROM oven/bun:1.1-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/dist           ./dist
COPY --from=builder /app/.generated     ./.generated
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/package.json   ./


EXPOSE 5000

CMD [ "bun","run","start" ]
