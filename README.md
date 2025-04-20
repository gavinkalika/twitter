# PHP 8.3 Development Environment

This repository contains a Docker setup for PHP 8.3 development environment with Composer installed.

## Prerequisites

- Docker installed on your machine

## Building and Running the Container

To build and run the container in one command:

```bash
docker build -t php8.3-dev . && docker run -it php8.3-dev
```

This command will:
1. Build the Docker image with tag `php8.3-dev`
2. Run the container in interactive mode immediately after building

## Features

- PHP 8.3 CLI
- Composer (PHP package manager)
- Essential tools: git, curl, zip/unzip
