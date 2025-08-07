
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const userInfo = document.getElementById("user-info");
const formSection = document.getElementById("form-section");
const suggestForm = document.getElementById("suggest-form");
const list = document.getElementById("suggestion-list");

auth.onAuthStateChanged(user => {
  if (user) {
    userInfo.textContent = "Connecté : " + user.email;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    formSection.style.display = "block";
    loadSuggestions();
  } else {
    userInfo.textContent = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    formSection.style.display = "none";
  }
});

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};
logoutBtn.onclick = () => auth.signOut();

suggestForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const content = document.getElementById("content").value;
  await db.collection("suggestions").add({
    title, category, content,
    createdAt: new Date(),
    author: auth.currentUser.email,
    status: "En attente"
  });
  suggestForm.reset();
  loadSuggestions();
};

async function loadSuggestions() {
  list.innerHTML = "";
  const snap = await db.collection("suggestions").orderBy("createdAt", "desc").get();
  snap.forEach(doc => {
    const s = doc.data();
    const div = document.createElement("div");
    div.className = "suggestion";
    div.innerHTML = "<h3>" + s.title + "</h3><p>" + s.content + "</p><small>par " + s.author + "</small>";
    list.appendChild(div);
  });
}
