# Aventra - AI-Powered Travel Itinerary Generator

![Aventra Logo](aventra-client/public/images/logo.png)

## 🌍 About Aventra

Aventra is a comprehensive travel planning platform that leverages AI to generate personalized travel itineraries. The platform consists of a Next.js frontend application and a FastAPI backend service that works together to create detailed travel plans tailored to user preferences.

## 🏗️ Project Structure

The project is organized into two main directories:

- **`/aventra-client`**: Next.js frontend application
- **`/server`**: FastAPI backend service

## ✨ Features

- 🧠 AI-powered itinerary generation
- 🌤️ Weather integration
- 🏨 Accommodation recommendations
- 🚗 Transportation options
- 🎯 Activity suggestions based on user preferences
- 🔍 Destination insights and trends
- 📱 Responsive design for desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- npm or yarn

### Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/aventra.git
cd aventra
```

2. Set up the frontend (Next.js)
```bash
cd aventra-client
npm install
```

3. Set up the backend (FastAPI)
```bash
cd ../server
pip install -r requirements.txt
```

4. Create environment variables
   - Create `.env` file in the root directory
   - Create `.env.local` file in the aventra-client directory

## 🏃‍♂️ Running the Application

### Running the Frontend

```bash
cd aventra-client
npm run dev
```

The frontend will be available at http://localhost:3000

### Running the Backend

```bash
cd server
uvicorn app.main:app --reload
```

The backend API will be available at http://localhost:8000

## 📝 API Documentation

Once the backend server is running, the API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📦 Deployment

### Frontend Deployment
The Next.js application can be deployed on Vercel or any other hosting platform that supports Next.js applications.

### Backend Deployment
The FastAPI backend can be deployed on services like AWS, Google Cloud, or Azure.

## 🔄 Project Workflow

1. User inputs travel preferences through the frontend interface
2. Frontend sends requests to the backend API
3. Backend processes the request using AI services like Google's Gemini
4. Backend returns customized itinerary data
5. Frontend displays the itinerary in a user-friendly format

## 🧰 Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Framer Motion
- Zustand (State Management)
- React Query

### Backend
- FastAPI
- Pydantic
- Google Generative AI
- Async processing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
