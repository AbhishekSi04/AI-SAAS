# User System Implementation

## Overview
This implementation adds a comprehensive user management system to your SaaS project with credits, transactions, and user data tracking.

## Database Schema

### New Models

#### User Model
- `id`: Unique identifier
- `clerkId`: Clerk user ID (unique)
- `email`: User email
- `firstName`, `lastName`: User name
- `avatar`: User avatar URL
- `credits`: Available credits (default: 10 for new users)
- `isActive`: Account status
- `createdAt`, `updatedAt`: Timestamps

#### CreditLog Model
- `id`: Unique identifier
- `userId`: User reference
- `amount`: Credit amount (positive for added, negative for used)
- `type`: PURCHASE, USAGE, REFUND, BONUS, ADMIN_ADJUSTMENT
- `description`: Transaction description
- `metadata`: Additional data (JSON)
- `createdAt`: Timestamp

#### Transaction Model
- `id`: Unique identifier
- `userId`: User reference
- `amount`: Amount in cents
- `currency`: Currency (default: USD)
- `status`: PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED
- `type`: CREDIT_PURCHASE, SUBSCRIPTION, REFUND
- `description`: Transaction description
- `stripePaymentIntentId`: Stripe payment intent ID
- `metadata`: Additional data (JSON)
- `createdAt`, `updatedAt`: Timestamps

#### Updated Video Model
- Added `userId`: User reference
- Added `status`: PROCESSING, COMPLETED, FAILED, CANCELLED
- Added `metadata`: Additional data (JSON)

#### Updated Image Model
- Added `userId`: User reference
- Added `title`, `description`: Image details
- Added `type`: UPLOADED, GENERATED, TRANSFORMED, BACKGROUND_REMOVED, EXTENDED
- Added `metadata`: Additional data (JSON)
- Added `updatedAt`: Timestamp

## Services

### UserService (`lib/services/userService.ts`)
- `createOrGetUser()`: Create or retrieve user from Clerk
- `getUserByClerkId()`: Get user by Clerk ID
- `getUserWithData()`: Get user with all related data
- `addCredits()`: Add credits to user
- `useCredits()`: Use credits from user
- `hasEnoughCredits()`: Check credit balance
- `getCreditHistory()`: Get credit transaction history
- `getDashboardData()`: Get dashboard statistics

### TransactionService (`lib/services/transactionService.ts`)
- `createTransaction()`: Create new transaction
- `updateTransactionStatus()`: Update transaction status
- `getUserTransactions()`: Get user transaction history
- `processSuccessfulPayment()`: Process payment and add credits
- `getUserTransactionStats()`: Get transaction statistics

## API Routes

### `/api/user/profile`
- GET: Get user profile with all related data

### `/api/user/credits`
- GET: Get user credit balance and history

### `/api/user/dashboard`
- GET: Get dashboard data with statistics

## Pages

### Dashboard (`/dashboard`)
- User profile information
- Credit balance display
- Statistics cards (videos, images, transactions)
- Recent activity sections
- Credit history

### Credits (`/credits`)
- Current credit balance
- Credit purchase packages
- Credit transaction history

## Components

### CreditsDisplay (`components/CreditsDisplay.tsx`)
- Displays current credit balance in navbar
- Auto-updates when credits change

### UserProvider (`lib/providers/UserProvider.tsx`)
- Ensures users are created in database on sign-in
- Automatically calls user profile API

## Credit System

### Credit Costs
- Image upload/transformation: 1 credit
- Video processing: 2 credits
- Background removal: 1 credit
- Image generation: 3 credits
- Image extension: 2 credits

### Credit Packages
- Basic Pack: 50 credits for $9.99
- Pro Pack: 150 credits for $24.99 (Most Popular)
- Premium Pack: 500 credits for $79.99

## Integration Points

### Updated API Routes
- `image-upload`: Now checks credits before processing
- All other routes can be updated similarly

### Middleware
- `ensureUserExists()`: Creates users in database
- `getCurrentUser()`: Gets current user from database

## Usage

1. **User Registration**: Users are automatically created when they sign in with Clerk
2. **Credit Management**: Credits are deducted for each operation
3. **Dashboard**: Users can view their activity and credit history
4. **Purchase Flow**: Users can purchase more credits (payment integration needed)

## Next Steps

1. **Payment Integration**: Implement Stripe for credit purchases
2. **Video Processing**: Update video upload routes to use credit system
3. **Image Processing**: Update all image processing routes
4. **Admin Panel**: Create admin interface for user management
5. **Analytics**: Add usage analytics and reporting
6. **Notifications**: Add credit balance notifications
7. **Subscription Plans**: Implement recurring subscriptions

## Environment Variables

Make sure to add these to your `.env` file:
```
DATABASE_URL=your_postgresql_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Database Migration

Run the migration to apply the new schema:
```bash
npx prisma migrate dev --name add_user_credit_system
``` 