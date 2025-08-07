
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const userInfo = document.getElementById("user-info");
const formSection = document.getElementById("form-section");
const suggestForm = document.getElementById("suggest-form");
const list = document.getElementById("suggestion-list");
const filterSelect = document.getElementById("filter-status");

let currentUser = null;
const staffEmails = ["redcommandrp@gmail.com"];

auth.onAuthStateChanged(user => {
  currentUser = user;
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
    author: currentUser.email,
    upvotes: 0,
    downvotes: 0,
    status: "En attente"
  });
  suggestForm.reset();
  loadSuggestions();
};

filterSelect.onchange = () => loadSuggestions();

async function loadSuggestions() {
  list.innerHTML = "";
  const filter = filterSelect.value;
  const snap = await db.collection("suggestions").orderBy("createdAt", "desc").get();
  let index = 0;
  for (const doc of snap.docs) {
    const s = doc.data();
    if (filter !== "all" && s.status !== filter) continue;

    const div = document.createElement("div");
    div.className = "suggestion";
    div.style.setProperty('--delay', `${index * 0.1}s`);
    div.innerHTML = `
      <h3>${s.title}</h3>
      <p>${s.content}</p>
      <p><small>par ${s.author} – ${s.category}</small></p>
      <p>👍 ${s.upvotes || 0} / 👎 ${s.downvotes || 0}</p>
      <p>Status : <strong>${s.status}</strong></p>
      <div class="comment-section" id="comments-${doc.id}"></div>
    `;

    const upBtn = document.createElement("button");
    upBtn.textContent = "👍";
    upBtn.onclick = () => vote(doc.id, "upvotes");

    const downBtn = document.createElement("button");
    downBtn.textContent = "👎";
    downBtn.onclick = () => vote(doc.id, "downvotes");

    div.appendChild(upBtn);
    div.appendChild(downBtn);

    if (currentUser && staffEmails.includes(currentUser.email)) {
      const acceptBtn = document.createElement("button");
      acceptBtn.textContent = "✅ Accepter";
      acceptBtn.onclick = () => updateStatus(doc.id, "Acceptée");

      const refuseBtn = document.createElement("button");
      refuseBtn.textContent = "❌ Refusée";
      refuseBtn.onclick = () => updateStatus(doc.id, "Refusée");

      div.appendChild(acceptBtn);
      div.appendChild(refuseBtn);
    }

    // Champ pour ajouter un commentaire
    const commentInput = document.createElement("input");
    commentInput.placeholder = "Ajouter un commentaire...";
    const commentBtn = document.createElement("button");
    commentBtn.textContent = "💬 Envoyer";
    commentBtn.onclick = () => addComment(doc.id, commentInput.value);

    div.appendChild(commentInput);
    div.appendChild(commentBtn);

    list.appendChild(div);
    loadComments(doc.id);
    index++;
  }
}

async function vote(docId, field) {
  const ref = db.collection("suggestions").doc(docId);
  await db.runTransaction(async (t) => {
    const doc = await t.get(ref);
    const val = (doc.data()[field] || 0) + 1;
    t.update(ref, { [field]: val });
  });
  loadSuggestions();
}

async function updateStatus(docId, status) {
  await db.collection("suggestions").doc(docId).update({ status });
  loadSuggestions();
}

async function addComment(docId, text) {
  if (!text.trim()) return;
  const ref = db.collection("suggestions").doc(docId).collection("comments");
  await ref.add({
    text,
    author: currentUser.email,
    createdAt: new Date()
  });
  loadComments(docId);
}

async function loadComments(docId) {
  const section = document.getElementById("comments-" + docId);
  section.innerHTML = "<h4>Commentaires :</h4>";
  const snap = await db.collection("suggestions").doc(docId).collection("comments").orderBy("createdAt").get();
  snap.forEach(doc => {
    const c = doc.data();
    const div = document.createElement("div");
    div.className = "comment";
    div.textContent = `${c.author} : ${c.text}`;
    section.appendChild(div);
  });
}
