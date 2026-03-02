// Firebase client initialization for Forge AI
// Uses the web SDK with Analytics enabled in the browser.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAUCcdwakiPZU6qXGjJxTjSlPnq4L9skig",
  authDomain: "forgeai-aeddc.firebaseapp.com",
  databaseURL: "https://forgeai-aeddc-default-rtdb.firebaseio.com",
  projectId: "forgeai-aeddc",
  storageBucket: "forgeai-aeddc.firebasestorage.app",
  messagingSenderId: "503169876303",
  appId: "1:503169876303:web:0c0798ec0bc41ff6f3053a",
  measurementId: "G-QB5KXMH5LE",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  // Analytics only runs in the browser; guard for safety.
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore analytics failures in non‑supported environments.
    });
}

export { app, analytics };

