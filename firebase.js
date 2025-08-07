
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBX8O16331ikac8PQ_biEu8c1KTGoA6Fhk",
  authDomain: "red-command-darkrp-889fd.firebaseapp.com",
  projectId: "red-command-darkrp-889fd",
  storageBucket: "red-command-darkrp-889fd.appspot.com",
  messagingSenderId: "186231864744",
  appId: "1:186231864744:web:98aa32b8eea2f18b67f19d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginButton = document.getElementById("login-btn");
if (loginButton) {
  loginButton.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Erreur d'authentification : " + error.message);
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("user-name").textContent = user.displayName;
    document.getElementById("suggest-form").style.display = "block";
  } else {
    document.getElementById("suggest-form").style.display = "none";
  }
});

const form = document.getElementById("suggest-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.getElementById("suggest-text").value;
    if (!content) return;

    try {
      await addDoc(collection(db, "suggestions"), {
        text: content,
        createdAt: serverTimestamp(),
        author: auth.currentUser ? auth.currentUser.displayName : "Anonyme"
      });
      document.getElementById("suggest-text").value = "";
      alert("Suggestion envoyée !");
      displaySuggestions();
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  });
}

async function displaySuggestions() {
  const container = document.getElementById("suggestions-list");
  if (!container) return;

  container.innerHTML = "";
  const q = query(collection(db, "suggestions"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "suggestion";
    div.innerHTML = `<strong>${data.author || "?"}</strong> : ${data.text}`;
    container.appendChild(div);
  });
}

displaySuggestions();
