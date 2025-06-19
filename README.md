# CreatorScout

CreatorScout is a web application for discovering and analyzing YouTube creators based on their performance metrics and influence scores.

## Features

- Search YouTube creators by keywords and topics
- View detailed creator metrics (subscribers, views, upload frequency)
- Calculate influence scores based on multiple factors
- Export creator data to CSV
- Track creator performance over time

## Tech Stack

- Frontend: React with Tailwind CSS
- Backend: Node.js/Express
- Database: SQLite
- API: YouTube Data API v3

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/creatorscout.git
cd creatorscout
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment files:

Backend (.env):
```
PORT=3000
DB_PATH=./database/creatorscout.db
YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## YouTube API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create API credentials (API Key)
5. Add the API key to your backend .env file

## Database Schema

The application uses SQLite with the following main tables:

- creators: Stores creator profiles and metrics
- videos: Tracks recent video performance
- search_history: Logs search queries and results

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 