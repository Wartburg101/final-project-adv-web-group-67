let sortButtonAlphabet = document.getElementById("sortButtonAlphabet");
let sortButtonArea = document.getElementById("sortButtonArea");

function toggleAlphabetButton() {
  sortButtonAlphabet.classList.add("active");
  sortButtonArea.classList.remove("active");
}
function toggleAreaButton() {
  sortButtonArea.classList.add("active");
  sortButtonAlphabet.classList.remove("active");
}

let signInNavButton = document.getElementById("signInNavButton");
let crossDownLogInButton = document.getElementById("crossDownLogInButton");
let loginScreen = document.getElementById("login-screen");

function toggleLoginButton(){
  
  if (loginScreen.classList.contains("activeLogin")) {
    loginScreen.classList.remove("activeLogin");
  } else {
    loginScreen.classList.add("activeLogin");
  }

}