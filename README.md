# PHP 8.3 Development Environment

This repository contains a Docker setup for PHP 8.3 development environment with Composer installed.

## Prerequisites

- Docker installed on your machine

## Building and Running the Container

To build and run the container with volume mapping and port forwarding:

```bash
docker build -t php8.3-dev . && docker run -it -v $(pwd):/app -w /app -p 8000:8000 php8.3-dev
```

This command will:
1. Build the Docker image with tag `php8.3-dev`
2. Run the container in interactive mode
3. Map your current directory to `/app` in the container
4. Set the working directory to `/app`
5. Forward port 8000 from the container to your host machine

1. Access the container shell:
```bash
docker exec -it $(docker ps -qf "ancestor=php8.3-dev") bash
```

2. Create a new Laravel project (choose one method):

Method A - Using Laravel installer:
```bash
composer global require laravel/installer
laravel new .
```

Method B - Using composer create-project:
```bash
composer create-project laravel/laravel .
```

3. Set proper permissions:
```bash
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

## Running Laravel

Start the Laravel development server:
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Access your Laravel application at:
```
http://localhost:8000
```

## Common Laravel Commands

Inside the container, you can use these Artisan commands:

```bash
# List all available commands
php artisan list

# Create a new controller
php artisan make:controller NameController

# Create a new model
php artisan make:model ModelName

# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear

# Create a new migration
php artisan make:migration create_table_name
```

## Features

- PHP 8.3 CLI with built-in development server
- Composer (PHP package manager)
- Laravel Framework
- Essential tools: git, curl, zip/unzip

🐦 Twitter Address

A utility that interacts with the Twitter (X) API to help automate and manage your account activity with ease.

⚙️ Features

🗑️ Delete Tweets
	•	Bulk-delete your entire tweet history.

📚 Retrieve Bookmarks
	•	Fetch all your saved bookmarks.

📁 Organize Bookmarks
	•	Sort and categorize bookmarks into folders based on keywords, hashtags, or domains.

🤖 Auto-Reply System
	•	Auto-reply to specific users when they tweet.
	•	Supports two reply modes:
	•	🧑‍💼 Professional Mode – polite, helpful responses.
	•	🧌 Trolling Mode – sarcastic, humorous responses.
	•	Add a user to the reply system and define their mode.

php twitter-address follow-user @username --mode=pro
php twitter-address follow-user @username --mode=troll

🕵️‍♂️ Spy (Spy Page Intelligence)
	•	Monitor public Twitter accounts.
	•	Get notified when they follow someone new.
	•	Displays who they followed and when.

php twitter-address Spy @elonmusk

🔐 Requirements
	•	Twitter Developer App with Elevated access
	•	OAuth2 user access token or Bearer Token

🚀 Usage

# Delete all tweets
php twitter-address delete-tweets

# Retrieve bookmarks
php twitter-address fetch-bookmarks

# Organize bookmarks into folders
php twitter-address organize-bookmarks

# Auto-reply setup
php twitter-address follow-user @username --mode=pro
php twitter-address follow