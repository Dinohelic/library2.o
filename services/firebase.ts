import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// =================================================================================
// --- IMPORTANT: FIREBASE CONFIGURATION REQUIRED ---
// =================================================================================
// You MUST replace the placeholder values below with your own Firebase project's
// configuration details. You can find these in your Firebase project settings.
// The error 'auth/api-key-not-valid' occurs because these are not real keys.
//
// How to find your config:
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Select your project.
// 3. Click the gear icon (Project settings) in the top-left corner.
// 4. In the "General" tab, scroll down to the "Your apps" section.
// 5. Select your web app.
// 6. In the "SDK setup and configuration" section, choose "Config" and copy the
//    configuration object here.
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDDVFkz2qqQWW4CJdS49TfdOBD1X33aIzY",
  authDomain: "living-library-ae612.firebaseapp.com",
  projectId: "living-library-ae612",
  storageBucket: "living-library-ae612.firebasestorage.app",
  messagingSenderId: "511786729089",
  appId: "1:511786729089:web:a760f35d26130c2e289780",
  measurementId: "G-6NKPP1R4NY"
};

// This flag will be used to show a helpful message to the user if the config is not set.
export const isFirebaseConfigValid = !firebaseConfig.apiKey.startsWith("YOUR_");

if (!isFirebaseConfigValid) {
  console.error(
    "ERROR: Firebase configuration is not set up correctly. " +
    "Please replace the placeholder values in 'services/firebase.ts' with your actual Firebase project credentials."
  );
}


// Initialize Firebase
// We initialize it anyway so the app doesn't crash, but features will be blocked by the UI.
const app = initializeApp(firebaseConfig);

// Export auth instance to be used in other parts of the app
export const auth = getAuth(app);