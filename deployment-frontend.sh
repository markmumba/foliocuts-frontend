#!/bin/bash

set -e

# -------- CONFIG --------
APP_NAME="foliocuts-frontend"
DOCKER_USERNAME="markian538"
PLATFORMS="linux/amd64"

TAG=$1
API_BASE_URL=$2

if [ -z "$TAG" ] || [ -z "$API_BASE_URL" ]; then
  echo "Usage: ./deployment-frontend.sh <tag> <api_base_url>"
  echo "Example:"
  echo "  ./deployment-frontend.sh v1.0.0 https://foliocuts.blazor-movies.online"
  exit 1
fi

IMAGE_NAME="$DOCKER_USERNAME/$APP_NAME:$TAG"

echo " Deploying frontend image: $IMAGE_NAME"
echo "API Base URL: $API_BASE_URL"
echo " Platforms: $PLATFORMS"

# -------- BUILD & PUSH MULTI-ARCH IMAGE --------
docker buildx build \
  --platform $PLATFORMS \
  --build-arg VITE_API_BASE_URL=$API_BASE_URL \
  -t $IMAGE_NAME \
  --push .

echo " Frontend deployment complete"
echo "Image pushed: $IMAGE_NAME"
