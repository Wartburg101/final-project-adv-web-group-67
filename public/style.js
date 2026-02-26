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

function toggleLoginButton() {
  if (loginScreen.classList.contains("activeLogin")) {
    loginScreen.classList.remove("activeLogin");
  } else {
    loginScreen.classList.add("activeLogin");
  }
}

function fixUrl(url) {
  if (!url) return "";
  const s = String(url).trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return "https://" + s;
}

async function loadVenues() {
  const list = document.getElementById("venueList");

  try {
    const res = await fetch("/stores"); // hämtar från server.js
    if (!res.ok) throw new Error("Kunde inte hämta /stores");

    const stores = await res.json();

    list.innerHTML = stores
      .map((store) => {
        // DB/JSON
        const title = store.name ?? "Okänt företag";
        const area = store.district ?? "";
        const url = fixUrl(store.url);

        return `
        <a href="${escapeHtml(url)}" class="venueItem" data-id="${store.id ?? ""}" target="_blank">
          <div class="venueInfoContainer">
            <p class="venueTitle">${escapeHtml(title)}</p>
            <p class="venueArea">${escapeHtml(area)}</p>
          </div>
          <div class="venueButtonContainer">
            <img src="./assets/images/arrow_right_alt.svg" alt="Öppna" />
          </div>
        </a>
      `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p>Kunde inte ladda venues.</p>`;
  }
}

// Liten helper
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadVenues();
