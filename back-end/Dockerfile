FROM node:24-alpine

ENV NODE_ENV=production
ENV PORT=4000
ENV DATABASE_FILE=/app/data/aurevia.sqlite

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev \
    && mkdir -p /app/data \
    && chown -R node:node /app

COPY --chown=node:node src ./src

USER node

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
    CMD node -e "fetch('http://127.0.0.1:4000/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "start"]
