FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/types/package.json packages/types/package.json

RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build -w @ppopgipang/types
RUN npm run build -w apps/backend
RUN npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3000
CMD ["node", "apps/backend/dist/main"]
