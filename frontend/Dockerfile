FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install
RUN pnpm run build

ENV NODE_ENV=production

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["npm", "run", "start"]
