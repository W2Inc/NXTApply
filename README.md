# NXTApply 🚀

**NXTApply** is a modern, multi-language student application management platform that simplifies the application for students. Built with SvelteKit and designed for scalability, it provides a complete solution for managing application events, tracks, and user onboarding.

<img width="1494" height="844" alt="image" src="https://github.com/user-attachments/assets/88c16deb-0849-426e-a2d9-4c09990b6c91" />

## 🚦 Getting Started

### Prerequisites
- Bun ^1.2.23

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/W2Inc/NXTApply.git
   cd NXTApply
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Configure the following variables:
   ```env
   # Database
   DATABASE_NAME="dev.db"
   DATABASE_URL="file:./prisma/${DATABASE_NAME}"
   DATABASE_URL_PRISMA="file:./${DATABASE_NAME}"

   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # App Configuration
   PUBLIC_APP_URL="http://localhost:5173"
   PUBLIC_APP_NAME="NXTApply"

   GEMINI_API_KEY="your-gemini-key" # Used for localization if you need it
   ```

4. **Set up the database**
   ```bash
   bunx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   bun --bun dev
   ```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── server/         # Server-side utilities and providers
│   ├── ui/            # shadcn/ui components
│   └── utils.ts       # Utility functions
├── locales/           # Internationalization files
├── routes/
│   ├── (app)/         # Main application routes
│   └── auth/          # Authentication routes
└── jobs/              # Background job definitions
```

## 🔐 Authentication

The platform supports OAuth authentication with:
- Google OAuth 2.0
- Extensible provider system for additional OAuth providers

Authentication is handled by the Arctic library for secure, standards-compliant OAuth flows.

## 📄 License
> License is not yet configured thus please contact before usage
This project is proprietary software owned by **W2Inc, Amsterdam**.  
© 2023-2025 W2Inc. All Rights Reserved.


