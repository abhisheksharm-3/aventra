# Aventra Client - Next.js Travel Planning Application

![Aventra Logo](public/images/logo.png)

## 🌟 Overview

Aventra Client is the frontend application for the Aventra Travel Planning Platform. It's built with Next.js, React 19, and TypeScript, featuring a beautiful UI with framer-motion animations, Tailwind CSS, and Radix UI components.

## ⚡ Features

- **Personalized Travel Planning**: AI-driven itinerary generation
- **User Authentication**: Secure login and user profile management
- **Onboarding Flow**: Guided user setup experience
- **Dashboard**: User-friendly travel planning workspace
- **Responsive Design**: Works seamlessly across devices
- **Dynamic Trip Customization**: Interactive itinerary editing tools
- **Dark/Light Mode**: Theme support via next-themes

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Auth Configuration (if applicable)
NEXT_PUBLIC_AUTH_PROVIDER=

# Feature Flags
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
aventra-client/
├── public/             # Static assets
│   └── images/         # Images and illustrations
├── src/
│   ├── app/            # Next.js App Router components and routes
│   │   ├── (auth)/     # Authentication routes
│   │   ├── (protected)/# Protected routes (dashboard, onboarding)
│   │   └── (public)/   # Public routes (about, contact, pricing)
│   ├── components/     # React components
│   │   ├── common/     # Shared components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── forms/      # Form components 
│   │   ├── hero/       # Hero section components
│   │   ├── layout/     # Layout components
│   │   ├── magicui/    # UI animation components
│   │   ├── navbar/     # Navigation components
│   │   ├── ui/         # UI building blocks
│   │   └── ...         # Other component directories
│   ├── controllers/    # Client-side controllers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and services
│   ├── stores/         # Zustand state stores
│   └── types/          # TypeScript type definitions
└── ...config files     # Various configuration files
```

## 🛠️ Key Technologies

- **Core**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, tailwind-merge
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion, AnimateCSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form, Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Remix Icon, Lucide React, Tabler Icons

## 📱 Application Structure

### Public Pages
- Landing page with feature showcase
- About page
- Pricing page
- Contact page

### Authentication
- Login page
- Registration flow

### Protected Area
- User onboarding
- Dashboard
- Trip planning interface
- Itinerary management
- User profile settings

## 👨‍💻 Development

### Code Style and Linting

```bash
# Run linting
npm run lint

# Format code
npm run format
```

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

## 🌐 API Integration

This frontend communicates with the Aventra backend server. Make sure the backend is running on the URL specified in your `.env.local` configuration.

## 🔌 Third-Party Integrations

- **Google Generative AI**: For AI-powered trip planning features
- **Maps Integration**: For location visualization

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Framer Motion Animation](https://www.framer.com/motion)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
