# BlinkAI - Intelligent Dark Store Management

BlinkAI is a modern, real-time application designed to streamline quick-commerce and dark store operations. It features intelligent inventory management, picker coordination, compliance tracking, and leverages Google's Gemini AI for demand forecasting and slotting optimization.

## 🌟 Key Features

* **Real-time Inventory Tracking:** Manage stock levels, expiry dates, and locations with live updates powered by Firebase Firestore.
* **AI-Powered Insights:** Uses Gemini AI to analyze local context for demand forecasting and suggests shelf slotting optimizations to reduce picking times.
* **Order & Picker Management:** Track active pickers, assign zones, and monitor order fulfillment metrics in real-time.
* **Barcode Scanning:** Built-in integration for QR/Barcode scanning for rapid stock adjustments and verification.
* **Compliance & Ticketing:** Log temperature checks, cleaning records, and track operational issues (tickets) efficiently.
* **Role-Based Access Control:** Differentiated access for Admins, Managers, and Pickers.
* **Mobile-First Design:** A progressive, fully responsive UI built with Tailwind CSS, optimized for mobile deployment.

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, TypeScript
* **Styling:** Tailwind CSS, Lucide React (Icons), framer-motion
* **Backend / Database:** Firebase (Authentication, Firestore Realtime Database)
* **AI Integration:** Google Gen AI SDK (Gemini 3.1 Pro/Flash)
* **Drag-and-Drop:** @dnd-kit

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* A Firebase Project with Firestore and Google Authentication enabled
* A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/blink-ai.git
   cd blink-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory (or configure them in your deployment platform) and add your keys:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_FIRESTORE_DATABASE_ID=your_database_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   *(Note: The codebase may use `firebase-applet-config.json` depending on your active setup. For purely local dev, standard `.env` patterns apply).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will start at `http://localhost:3000`.

## 📦 Deployment (Vercel)

This project uses a "Flat" structure without a `src` folder, optimizing it for direct manual uploads or streamlined Vercel deployments.

1. Go to [Vercel](https://vercel.com) and import your GitHub repository.
2. In the project settings, ensure the **Build Command** is `npm run build` and **Output Directory** is `dist`.
3. Add the Environment Variables listed in the Installation step.
4. Click **Deploy**.

## 🔒 Firebase Security Rules

To secure your production database, apply the rules below in your Firebase Console (Firestore -> Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() {
      return isAuthenticated() &&
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin' ||
         (request.auth.token.email == "your-admin-email@gmail.com" && request.auth.token.email_verified == true));
    }
    // Implement granular collection rules based on your app's needs
    match /{document=**} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

---
*Built with React, Firebase, and Gemini AI.*
