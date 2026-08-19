FROM node:22-alpine AS deps
WORKDIR /app/backend
# better-sqlite3 has no musl prebuild; node-gyp needs these only at install time.
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app/backend
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=deps /app/backend/node_modules ./node_modules
RUN npm prune --omit=dev
COPY --from=build /app/backend/dist ./dist
EXPOSE 3011
CMD ["node", "dist/server.js"]
