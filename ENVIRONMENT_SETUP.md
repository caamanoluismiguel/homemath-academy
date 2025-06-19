# HomeMath Academy Environment Variables

## Required Environment Variables

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://postgres:password@localhost:5432/homemath_academy`

### OpenAI API Configuration
- `OPENAI_API_KEY` - OpenAI API key for AI-powered features
  - Used for: Growth plan generation, insight reports, quiz generation
  - Get from: https://platform.openai.com/api-keys

### Firebase Authentication (if implementing)
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase private key (base64 encoded)
- `FIREBASE_CLIENT_EMAIL` - Firebase client email
- `FIREBASE_API_KEY` - Firebase web API key
- `FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `FIREBASE_STORAGE_BUCKET` - Firebase storage bucket

### Next.js Configuration
- `NEXTAUTH_SECRET` - Secret for NextAuth.js (if using NextAuth)
- `NEXTAUTH_URL` - Base URL for the application
- `NODE_ENV` - Environment (development/production)

## Current Implementation Status

### Authentication
- Currently using simple email/name mockup authentication
- Ready to be replaced with Firebase Auth or NextAuth.js

### AI Services
- Currently using comprehensive mock implementations
- Ready to be replaced with OpenAI API calls
- Mock services include:
  - Growth plan generation
  - Daily lesson generation
  - Quiz generation
  - Insight report generation

### Database
- Prisma ORM configured for PostgreSQL
- Comprehensive schema with all required models
- Ready for migration and seeding

## Next Steps
1. Set up PostgreSQL database
2. Create .env.local file with required variables
3. Replace mock AI services with OpenAI API integration
4. Implement Firebase authentication
5. Test all user flows

