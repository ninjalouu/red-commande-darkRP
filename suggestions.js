
document.getElementById("googleSignIn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      alert(`Connecté en tant que : ${user.displayName}`);
    })
    .catch((error) => {
      console.error("Erreur d'authentification :", error);
      alert("Erreur d'authentification. Vérifie la console.");
    });
});
