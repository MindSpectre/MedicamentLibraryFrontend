# Stage 1: Build the Next.js application
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the entire project
COPY . .

# Build the production version of the app
RUN pnpm build

# Stage 2: Serve the Next.js application in production
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./
COPY --from=build /app/public ./public
# Removed the next.config.js copy since it does not exist

# Install only production dependencies
RUN npm install -g pnpm
RUN pnpm install --prod

# Expose the desired port
EXPOSE 3001

# Set environment variable
ENV NODE_ENV=production

# Start the Next.js server
CMD ["pnpm", "start", "-p", "3001"]
