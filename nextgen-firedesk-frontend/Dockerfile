# ===== build stage =====
FROM node:18-alpine AS build

# allow passing a Vite env var at build time
ARG VITE_INTERNAL_API_PATH
ENV VITE_INTERNAL_API_PATH=$VITE_INTERNAL_API_PATH

WORKDIR /app

# install deps (use package-lock for reproducible installs)
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# optional debug: print env var into build logs
RUN echo ">>> VITE_INTERNAL_API_PATH=$VITE_INTERNAL_API_PATH"

# build the frontend (adjust if your project uses yarn)
RUN npm run build

# if the tool produced dist/ move it to build/ so later COPY works
RUN if [ -d /app/dist ] && [ ! -d /app/build ]; then mv /app/dist /app/build; fi

# ===== runtime stage (nginx) =====
FROM nginx:stable-alpine

# remove default nginx html to avoid welcome page being served
RUN rm -rf /usr/share/nginx/html/*

# copy built app from build stage into nginx html root
# expects built output at /app/build (the normalize step above guarantees it)
COPY --from=build /app/build/ /usr/share/nginx/html/

# copy a custom nginx config (place nginx/default.conf next to this Dockerfile)
# If you don't want to include a custom config, you can remove this line
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

