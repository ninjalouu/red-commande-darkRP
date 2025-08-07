
const loginBtn = document.getElementById("login");

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      alert("Connecté en tant que " + user.displayName);
    })
    .catch(error => {
      console.error("Erreur connexion Google :", error);
    });
};
