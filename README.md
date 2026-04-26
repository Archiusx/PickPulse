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
* **AI Integration:** Google Gen AI SDK (Gemini)

## 🚀 Deployment (Vercel)

This project has a "Flat" structure (all files in the main directory), making it exceptionally easy to host on Vercel right from your phone.

### Step-by-Step Vercel Guide
1. Go to [Vercel](https://vercel.com) and log in.
2. Select **Add New** -> **Project**.
3. Import your `BlinkAI` GitHub repository.
4. **Environment Variables:** Make sure you expand the "Environment Variables" section before deploying and add the following key:
   * **Name:** `GEMINI_API_KEY`
   * **Value:** (Your Google Gemini API Key)
   
*(Note: Ensure you include the Gemini API Key or the AI prediction features will be disabled).*

5. Click **Deploy**.

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
         (request.auth.token.email == "adityadeshakar@gmail.com" && request.auth.token.email_verified == true));
    }
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || (isAuthenticated() && request.auth.uid == userId);
    }
    match /inventory/{itemId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
      match /history/{historyId} {
        allow read, create: if isAuthenticated();
      }
    }
    match /{path=**} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

---
*Built with React, Firebase, and Gemini AI.*

