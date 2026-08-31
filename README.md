# DevEvent

DevEvent is a modern events discovery app for developers. It helps users browse upcoming tech events, view event details, and reserve a spot for events they want to attend.

## Features

- Browse featured developer events
- View detailed event information and agenda
- Book a spot for an event
- MongoDB-backed event data and admin event creation flow
- Built with Next.js 16 and App Router

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- Cloudinary for image uploads
- Vercel deployment

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- MongoDB connection string
- Cloudinary credentials

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root with the following values:

```bash
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

If you are deploying on Vercel, set the same variables in the Vercel project environment settings.

### Run the app locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project structure

```bash
app/
  api/
  events/
components/
lib/
  actions/
  mongodb.ts
  utils.ts
database/
public/
```

## Production build

```bash
npm run build
```

## Deployment

This app is designed to deploy on Vercel.

Before deploying:

1. Add your environment variables in Vercel
2. Connect the GitHub repository
3. Deploy the project

## Notes

This is a public GitHub repository, so keep secrets and production credentials out of version control.
