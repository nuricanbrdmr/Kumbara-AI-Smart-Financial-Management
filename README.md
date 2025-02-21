<p align="center">
  <img src="https://github.com/user-attachments/assets/0b63ca70-031f-4afe-a65b-711b3b19cf85" alt="Kumbara AI Logo" width="200"/>
</p>

# Kumbara AI - Smart Financial Management

## Overview

Kumbara AI is a modern financial management application that leverages artificial intelligence to provide smart financial insights and recommendations. Built with React Native and Firebase, it offers personalized financial management tools powered by AI.

## Features

### 🤖 AI-Powered Features

- **Smart Savings Analysis**: Personalized savings recommendations based on spending patterns
- **Savings Forecast**: AI-driven predictions for achieving financial goals
- **Market Intelligence**: Smart market analysis and investment recommendations

### 💰 Core Features

- **Transaction Management**: Track and categorize expenses
- **Multi-wallet Support**: Manage multiple financial accounts
- **Real-time Updates**: Instant synchronization across devices
- **Search Functionality**: Quick access to transaction history

## Technology Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Context
- **UI Components**: Custom components with React Native

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/kumbara-ai.git
```

2. Install dependencies

```bash
cd kumbara-ai
npm install
```

3. Configure Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
1. Enable Authentication and Firestore in your Firebase project
1. Get your Firebase configuration from Project Settings
1. Create `config/firebase.ts` with your Firebase credentials:

````typescript
const FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

4. Environment Setup
# Cloudinary Configuration
```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
```
# Google Gemini AI API
```env
EXPO_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
```
# Firebase Configuration
```env
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_PROJECT_ID=your_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_APP_ID=your_app_id
EXPO_PUBLIC_MEASUREMENT_ID=your_measurement_id
```

5. Start the development server

```bash
npm run android or npx expo start -c
````

## Project Structure

```
kumbara-ai/
├── app/                   # App screens and navigation
├── assets/               # Images and static assets
├── components/           # Reusable UI components
├── config/              # Configuration files
├── constants/           # Theme and constant values
├── contexts/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API and service functions
├── types.ts              # TypeScript type definitions
└── utils/              # Utility functions
```
## Screenshot
![kumbara](https://github.com/user-attachments/assets/261b0e11-b2b5-47db-baeb-6bb0ada5679e)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please reach out to [nuricanb1903@gmail.com]
