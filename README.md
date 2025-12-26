# Gator CLI

A command-line RSS feed aggregator for managing feeds and browsing posts.

## Prerequisites

- **Node.js** (v22 or higher recommended)
- **PostgreSQL** (v18 or higher)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/joshjavier/gator-cli
cd gator-cli
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:

   - **Option A**: Use Docker Compose (recommended)
     ```bash
     docker compose up -d
     ```
     This will start PostgreSQL on port 5555 with:
     - Username: `postgres`
     - Password: `postgres`

   - **Option B**: Use an existing PostgreSQL instance
     - Ensure PostgreSQL is running on your system

4. Run database migrations:
```bash
npm run generate
npm run migrate
```

## Configuration

Create a configuration file at `~/.gatorconfig.json` with the following structure:

```json
{
  "db_url": "postgres://postgres:postgres@localhost:5555/postgres",
  "current_user_name": ""
}
```

- **db_url**: Connection string to your PostgreSQL database
- **current_user_name**: Will be automatically set when you log in

## Running the CLI

Start the application with:
```bash
npm start <command> [args...]
```

## Available Commands

### User Management
- **`register <username>`** - Create a new user account
- **`login <username>`** - Log in to an existing account
- **`reset`** - Delete all users from the database
- **`users`** - List all users

### Feed Management
- **`addfeed <name> <url>`** - Add a new RSS feed (requires login)
  - Example: `npm start addfeed "TechNews" "https://example.com/feed.xml"`
- **`feeds`** - List all available feeds
- **`follow <feed-name>`** - Follow a feed (requires login)
- **`following`** - List all feeds you're following (requires login)
- **`unfollow <feed-name>`** - Stop following a feed (requires login)

### Feed Aggregation & Browsing
- **`agg <time_between_reqs>`** - Continuously collect and aggregate RSS feeds (requires login)
  - Example: `npm start agg 10s` - Fetches feeds every 10 seconds
  - Example: `npm start agg 1m` - Fetches feeds every 1 minute
  - Supports time formats: `10s`, `5m`, `1h`, etc.
  - Press Ctrl+C to stop the aggregator
- **`browse <limit>`** - Browse posts in an interactive interface (requires login)

## Usage Examples

```bash
# Register a new user
npm start register alice

# Log in
npm start login alice

# Add a feed
npm start addfeed "Hacker News" "https://news.ycombinator.com/rss"

# Follow the feed
npm start follow "Hacker News"

# View your subscriptions
npm start following

# Aggregate and view recent posts
npm start agg 1m

# Unfollow a feed
npm start unfollow "Hacker News"
```

## Database Setup Details

The application uses Drizzle ORM to manage the PostgreSQL database. The schema includes:
- **users** - User accounts
- **feeds** - RSS feeds
- **feed_follows** - User subscriptions to feeds
- **posts** - Aggregated posts from feeds

## License

MIT
