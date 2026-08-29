# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Branding and service URLs are resolved at build time — the remark plugin
# bakes them into the compiled pages, so these must arrive as build args, not
# runtime env. Unset means FoPost. Changing one needs a rebuild.
ARG NEXT_PUBLIC_BRAND_NAME
ARG NEXT_PUBLIC_BRAND_SLUG
ARG NEXT_PUBLIC_BRAND_DOMAIN
ARG NEXT_PUBLIC_BRAND_LOGO
ARG NEXT_PUBLIC_BRAND_FAVICON
ARG NEXT_PUBLIC_WEBSITE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DOCS_URL
ENV NEXT_PUBLIC_BRAND_NAME=$NEXT_PUBLIC_BRAND_NAME \
    NEXT_PUBLIC_BRAND_SLUG=$NEXT_PUBLIC_BRAND_SLUG \
    NEXT_PUBLIC_BRAND_DOMAIN=$NEXT_PUBLIC_BRAND_DOMAIN \
    NEXT_PUBLIC_BRAND_LOGO=$NEXT_PUBLIC_BRAND_LOGO \
    NEXT_PUBLIC_BRAND_FAVICON=$NEXT_PUBLIC_BRAND_FAVICON \
    NEXT_PUBLIC_WEBSITE_URL=$NEXT_PUBLIC_WEBSITE_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_DOCS_URL=$NEXT_PUBLIC_DOCS_URL

RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 80
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
