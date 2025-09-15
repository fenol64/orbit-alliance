FROM node:22-alpine AS base

# ---------

FROM base AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# ---------
FROM base as builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# ---------

FROM gcr.io/distroless/base:nonroot AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=nonroot:nonroot /app/backend ./backend

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

CMD ["./backend"]
