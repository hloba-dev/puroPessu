# Puro — production image for a VPS (Next.js standalone output).
#
#   docker build -t puropesu \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://puropesu.fi \
#     --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co \
#     --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... \
#     --build-arg NEXT_PUBLIC_GTM_ID=GTM-PFGKLQJ5 \
#     --build-arg NEXT_PUBLIC_GA_ID= --build-arg NEXT_PUBLIC_GADS_ID= --build-arg NEXT_PUBLIC_GADS_BOOKING_LABEL= .
#   docker run -d -p 3000:3000 --env-file .env.production puropesu
#
# NEXT_PUBLIC_* values are compiled into the bundle, so they are build arguments.
# Everything else (Supabase secret key, SMTP settings) is read at runtime from the environment.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL=https://puropesu.fi
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_GTM_ID=GTM-PFGKLQJ5
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_GADS_ID
ARG NEXT_PUBLIC_GADS_BOOKING_LABEL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_GADS_ID=$NEXT_PUBLIC_GADS_ID \
    NEXT_PUBLIC_GADS_BOOKING_LABEL=$NEXT_PUBLIC_GADS_BOOKING_LABEL \
    NEXT_OUTPUT=standalone \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
# standalone already contains the traced server files, blog content (content/) and PDF fonts (assets/fonts)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
