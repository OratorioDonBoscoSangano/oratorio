/* Configurazione del sito: già compilata, non va più toccata.
   Quando arriva un index.html aggiornato, questo file resta com'è. */

// 1. Indirizzo del server: la distribuzione Apps Script.
window.URL_APP = 'https://script.google.com/macros/s/AKfycbzb0yb6M0udSqqkArNuD6xrGYQv5Dr-uShOR7cyF-VbYE9MVmeGdwFqO7WZVDcrQp-PNA/exec';

// 2. Configurazione web di Firebase (progetto OratorioDonBoscoSangano).
//    Valori pubblici per loro natura: stanno dentro la pagina, non sono password.
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCiNoQrHLX9ctGqScUg3j5N5k6rYp7cjdU',
  authDomain: 'oratoriodonboscosangano-8f971.firebaseapp.com',
  projectId: 'oratoriodonboscosangano-8f971',
  storageBucket: 'oratoriodonboscosangano-8f971.firebasestorage.app',
  messagingSenderId: '45494985690',
  appId: '1:45494985690:web:eaf659a29e16a478db16e3'
};

// 3. Chiave pubblica con cui i browser si iscrivono alle notifiche.
window.VAPID_KEY = 'BBRobv9zHEnuqD0F-PW4_WpUzF9ldUmL2tZ9iP_sO15mVmdW3fd_zMMXo0zjAxae8m0R-1pCuWPpbGIEqOXeT2E';
