# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Use same-origin /api so the build is portable across environments
# (nginx proxies /api to the backend container).
ENV VITE_API_URL=/api
# Nomor WhatsApp tujuan pesanan katalog (di-inject saat build dari compose args)
ARG VITE_WA_ORDER_NUMBER=628557271197
ENV VITE_WA_ORDER_NUMBER=$VITE_WA_ORDER_NUMBER
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
