# 🎨 MediaMorph - AI-Powered Media Processing Platform

> Transform your creative vision with cutting-edge AI technology. Upload, enhance, and generate stunning images and videos with our comprehensive media processing suite.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2d3748?logo=prisma)](https://prisma.io/)

## Features

### Image Processing
- **AI Image Generation** - Create stunning images from text prompts using FLUX.1-schnell
- **Background Removal** - Intelligent background removal with precision
- **Image Enhancement** - Transform and enhance images with AI filters
- **Image Extension** - Expand image boundaries seamlessly
- **Generative Replace** - Replace objects in images using AI
- **Smart Resize** - Intelligent image resizing for social media

### Video Processing
- **Video Upload & Compression** - Optimize video files for web
- **Format Conversion** - Convert between video formats
- **Quality Enhancement** - AI-powered video upscaling

### Credit System
- **Flexible Pricing** - Pay-per-use credit system
- **Stripe Integration** - Secure payment processing
- **Real-time Balance** - Track credit usage and purchases
- **Transaction History** - Complete payment audit trail

### Authentication & Security
- **Clerk Authentication** - Secure user management
- **Role-based Access** - Protected routes and features
- **Session Management** - Persistent user sessions

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Clerk** - Authentication & user management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database operations
- **NeonDB** - Serverless PostgreSQL database
- **Cloudinary** - Media storage and optimization

### AI & Processing
- **Gradio Client** - AI model integration
- **FLUX.1-schnell** - Advanced image generation
- **Cloudinary AI** - Image transformation APIs

### Payments
- **Stripe** - Payment processing
- **Webhooks** - Real-time payment notifications
- **Credit Management** - Usage tracking system

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (NeonDB recommended)
- Stripe account for payments
- Cloudinary account for media storage
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Database
   DATABASE_URL="your-neon-db-url"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
   
   # App
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```bash
app/
├── (app)/                 # Protected app routes
│   ├── dashboard/         # User dashboard
│   ├── credits/          # Credit management
│   ├── generate-image/   # AI image generation
│   └── layout.tsx        # App layout with sidebar
├── api/                  # API routes
│   ├── checkout/         # Stripe checkout
│   ├── webhook/          # Payment webhooks
│   ├── user/            # User management
│   └── generate-image/   # Image generation API
├── components/           # Reusable components
├── lib/                 # Utilities and services
│   ├── services/        # Business logic
│   └── db.ts           # Database connection
└── types/              # TypeScript definitions
```

## API Endpoints

### Authentication
- `POST /api/user/create` - Create user account
- `GET /api/user/profile` - Get user profile
- `GET /api/user/dashboard` - Dashboard data

### Media Processing
- `POST /api/generate-image` - AI image generation
- `POST /api/image-transform` - Image transformation
- `POST /api/remove-background` - Background removal
- `POST /api/image-extender` - Image extension

### Payments
- `POST /api/checkout` - Create payment session
- `POST /api/webhook` - Stripe webhook handler
- `GET /api/user/credits` - Credit balance

## Credit System

| Operation | Credits Required |
|-----------|------------------|
| Image Generation | 3 credits |
| Background Removal | 2 credits |
| Image Transform | 1 credit |
| Video Processing | 3-5 credits |

### Credit Packages
- **Starter**: 100 credits - Free
- **Professional**: 1,000 credits - $49
- **Premium**: 10,000 credits - $99

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy with zero configuration

### Manual Deployment
```bash
npm run build
npm start
```

## Security Features

- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - API endpoint protection
- **Secure Headers** - Security-first configuration
- **Environment Isolation** - Separate dev/prod configs
- **Payment Security** - PCI-compliant Stripe integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Stripe](https://stripe.com/) - Payment processing platform
- [Cloudinary](https://cloudinary.com/) - Media management solution
- [Clerk](https://clerk.com/) - Authentication & user management
- [NeonDB](https://neon.tech/) - Serverless PostgreSQL

---

<div align="center">
  <p>Built with ❤️ using Next.js and modern web technologies</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
