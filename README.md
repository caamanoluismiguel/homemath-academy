# HomeMath Academy

AI-Powered Math Placement & Growth for Christian Homeschooling Families

## Overview

HomeMath Academy is a comprehensive platform that provides AI-driven math placement tests and personalized growth plans for homeschooling families. Built with Next.js, TypeScript, and powered by OpenAI.

## Features

- 🤖 AI-powered math placement testing
- 📊 Personalized growth plans and insights
- 👨‍👩‍👧‍👦 Multi-child family management
- 🔐 Secure authentication with Firebase
- 📱 Responsive design for all devices
- 🎯 Grade-specific content (K-8)
- 🌍 Multi-language support

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **AI:** OpenAI GPT-4
- **Authentication:** Firebase Auth
- **Deployment:** Railway

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/homemath-academy.git
cd homemath-academy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Fill in your actual values in .env
```

4. Set up the database:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

This application is configured for deployment on Railway:

1. Connect your GitHub repository to Railway
2. Set up environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## License

Private - All rights reserved

## Support

For support, email support@homemath-academy.com

