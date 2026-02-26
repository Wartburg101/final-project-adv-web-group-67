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

/*LOGIN FUNCTIONALITY*/ 

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const signInNavButton = document.getElementById("signInNavButton");
  const addButton = document.getElementById("addButton");

  async function attemptLogin(e) {
    if (e) e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    try {
      const resp = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toggleLoginButton();
        refreshNav();
      } else {
        alert('Login failed: ' + (data.error || 'Invalid credentials'));
      }
    } catch (err) {
      console.error('Login error', err);
      alert('Login error');
    }
  }

  function refreshNav() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      signInNavButton.textContent = 'Sign Out';
      signInNavButton.onclick = () => { localStorage.removeItem('user'); refreshNav(); };
    } else {
      signInNavButton.textContent = 'Sign In';
      signInNavButton.onclick = () => toggleLoginButton();
    }
  }

  if (loginButton) loginButton.addEventListener('click', attemptLogin);
  refreshNav();
});

