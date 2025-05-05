# Dashboard App

This is a feature-rich dashboard application built with [Next.js](https://nextjs.org), designed to provide real-time analytics, shop management, and user profile management. The app integrates Firebase for authentication and Firestore as the database.

## Features

- **Authentication**: Secure user authentication using Firebase, including Google Sign-In.
- **Dashboard**: Real-time analytics and insights for business performance.
- **Admin Panel**: Manage shops, products, and sales data.
- **User Profile**: View and update user account details.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS and DaisyUI components.
- **Data Visualization**: Interactive charts and graphs using Recharts.

## Project Structure

```
app/
  ├── about/          # Help and support page
  ├── admin/          # Admin panel for managing shops and products
  │   └── dashboard/  # Admin dashboard with analytics
  ├── dashboard/      # User dashboard with real-time data
  ├── profile/        # User profile management
  ├── signin/         # Sign-in page
  └── layout.js       # Root layout component

components/
  ├── ui/             # Reusable UI components (e.g., buttons, cards, tables)
  ├── GoogleSignIn.js # Google Sign-In component
  └── Protected.js    # Protected route wrapper

lib/
  ├── AuthContext.js  # Authentication context for managing user state
  ├── firebase.js     # Firebase configuration and initialization
  ├── firestore.js    # Firestore database operations
  └── utils.js        # Utility functions

public/               # Static assets (e.g., images, icons)
```

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com), [DaisyUI](https://daisyui.com)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Charts**: [Recharts](https://recharts.org)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/dashboard.git
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a `.env.local` file in the root directory.
   - Add your Firebase configuration:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The app can be deployed on [Vercel](https://vercel.com) or any platform that supports Next.js. Follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

