#!/bin/bash

IMAGE_NAME="twitter-cli"
BUILD=false

for arg in "$@"; do
    if [ "$arg" = "--build" ]; then
        BUILD=true
    fi
done

if [ "$BUILD" = true ] || ! docker image inspect "$IMAGE_NAME" &>/dev/null; then
    echo "Building Docker image..."
    docker build -t "$IMAGE_NAME" .
fi

if [ $# -eq 0 ] || ([ $# -eq 1 ] && [ "$1" = "--build" ]); then
    echo "Usage: $0 [--build] <username>"
    echo "  --build    Force rebuild the Docker image"
    echo "  <username> Twitter username to fetch tweets from"
    exit 1
fi

USERNAME="${@: -1}"

if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Make sure TWITTER_BEARER_TOKEN is set."
    docker run -it --rm "$IMAGE_NAME" "$USERNAME"
else
    docker run -it --rm --env-file .env "$IMAGE_NAME" "$USERNAME"
fi