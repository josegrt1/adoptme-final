FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./

RUN chown -R node:node /app

USER node

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

EXPOSE 8080

CMD ["npm", "start"]