let sortButtonAlphabet = document.getElementById("sortButtonAlphabet");
let sortButtonArea = document.getElementById("sortButtonArea");

function toggleAlphabetButton() {
  sortButtonAlphabet.classList.add("active");
  sortButtonArea.classList.remove("active");
  loadVenues(); // stores alphabetically
}
function toggleAreaButton() {
  sortButtonArea.classList.add("active");
  sortButtonAlphabet.classList.remove("active");
  loadVenues(); // Area, sort by district
}

let signInNavButton = document.getElementById("signInNavButton");
let crossDownLogInButton = document.getElementById("crossDownLogInButton");
let loginScreen = document.getElementById("login-screen");

/*LOGIN FUNCTIONALITY*/

function toggleLoginButton() {
  if (loginScreen.classList.contains("activeLogin")) {
    loginScreen.classList.remove("activeLogin");
  } else {
    loginScreen.classList.add("activeLogin");
  }
}

let adminScreen = document.getElementById("admin-add-screen");
let editScreen = document.getElementById("admin-edit-screen");
let crossDownAdminButton = document.getElementById("crossDownAdminButton");
let openAdminScreenButton = document.getElementById("addButton");
let currentEditingStoreId = null;

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
      const resp = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toggleLoginButton();
        toggleAdminFunctionality();
        refreshNav();
      } else {
        alert("Login failed: " + (data.error || "Invalid credentials"));
      }
    } catch (err) {
      console.error("Login error", err);
      alert("Login error");
    }
  }

  function toggleAdminFunctionality() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      addButton.style.display = "flex";
      editStores();
    } else {
      addButton.style.display = "none";
      editStores();
    }
  }

  function refreshNav() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      signInNavButton.textContent = "Sign Out";
      signInNavButton.onclick = () => {
        localStorage.removeItem("user");
        refreshNav();
        toggleAdminFunctionality();
      };
    } else {
      signInNavButton.textContent = "Sign In";
      signInNavButton.onclick = () => toggleLoginButton();
    }
  }

  if (loginButton) loginButton.addEventListener("click", attemptLogin);
  refreshNav();
  toggleAdminFunctionality();
});

function editStores() {
  const user = JSON.parse(localStorage.getItem("user"));
  let venueItems = document.querySelectorAll(".venueItem");

  venueItems.forEach((item) => {
    const existingButton = item.querySelector(".venueEditButton");

    if (user) {
      // User is logged in as admin - add button if it doesn't exist
      if (!existingButton) {
        const editButton = document.createElement("button");
        editButton.className = "venueEditButton";
        editButton.textContent = "Edit";
        editButton.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const storeId = item.dataset.id;
          const title = item.querySelector(".venueTitle")?.textContent || "";
          const area = item.querySelector(".venueArea")?.textContent || "";
          const url = item.href || "";
          toggleEditScreen(storeId, {
            id: storeId,
            name: title,
            district: area,
            url: url,
          });
        };

        const buttonContainer = item.querySelector(".venueButtonContainer");
        buttonContainer.appendChild(editButton);
      }
    } else {
      // User is not logged in - remove button if it exists
      if (existingButton) {
        existingButton.remove();
      }
    }
  });
}

function toggleEditScreen(storeId, store = null) {
  if (editScreen.classList.contains("activeAdmin")) {
    editScreen.classList.remove("activeAdmin");
  } else {
    if (store) {
      // Populate form fields with venue data
      document.getElementById("editVenueName").value = store.name || "";
      document.getElementById("editVenueArea").value = store.district || "";
      document.getElementById("editVenueUrl").value = store.url || "";
      currentEditingStoreId = storeId;
    }
    editScreen.classList.add("activeAdmin");
  }
}

function toggleAdminScreen() {
  // ensure we use the same class as defined in CSS
  if (adminScreen.classList.contains("activeAdmin")) {
    adminScreen.classList.remove("activeAdmin");
  } else {
    adminScreen.classList.add("activeAdmin");
  }
}

function fixUrl(url) {
  if (!url) return "";
  const s = String(url).trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return "https://" + s;
}

// update, sort by letters

function firstLetter(name) {
  const s = (name || "").trim();
  return s ? s[0].toUpperCase() : "#";
}

function isAlphabetMode() {
  return sortButtonAlphabet?.classList.contains("active");
}

function areaKey(district) {
  const s = (district || "").trim();
  return s ? s : "N/A";
}

function sortStores(stores) {
  // Om Area är aktiv -> sortera på district, annars på name
  if (!isAlphabetMode()) {
    return [...stores].sort((a, b) => {
      const d = (a.district || "").localeCompare(b.district || "", "sv", {
        sensitivity: "base",
      });
      if (d !== 0) return d;
      return (a.name || "").localeCompare(b.name || "", "sv", {
        sensitivity: "base",
      });
    });
  }

  return [...stores].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "sv", { sensitivity: "base" }),
  );
}

function renderStoresGrouped(stores) {
  const list = document.getElementById("venueList");
  list.innerHTML = "";

  const sorted = sortStores(stores);

  const groups = new Map();

  for (const store of sorted) {
    const key = isAlphabetMode()
      ? firstLetter(store.name)
      : areaKey(store.district);

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(store);
  }
  // Sort Unknown Area (N/A) last, otherwise alphabetically
  const keys = Array.from(groups.keys()).sort((a, b) => {
    if (a === "N/A") return 1;
    if (b === "N/A") return -1;
    return a.localeCompare(b, "sv", { sensitivity: "base" });
  });

  list.innerHTML = keys
    .map((key) => {
      const itemsHtml = groups
        .get(key)
        .map((store) => {
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

      return `
        <section class="letter-section">  
          <h2 class="letter-title">${escapeHtml(key)}</h2>
          <div class="letter-grid"> 
            ${itemsHtml}
          </div>
        </section>
      `;
    })
    .join("");
}

async function loadVenues() {
  const list = document.getElementById("venueList");
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const res = await fetch("/stores"); // hämtar från server.js
    if (!res.ok) throw new Error("Kunde inte hämta /stores");
    const stores = await res.json();
    renderStoresGrouped(stores);
    editStores();
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

function addNewVenue() {
  const name = document.getElementById("venueName").value;
  const district = document.getElementById("venueArea").value;
  const url = document.getElementById("venueUrl").value;

  try {
    fetch("/venues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, district, url }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte lägga till venue");
        return res.json();
      })
      .then((data) => {
        alert("Venue tillagd!");
        loadVenues();
        name.value = "";
        district.value = "";
        url.value = "";
      })
      .catch((err) => {
        console.error(err);
        alert("Kunde inte lägga till venue");
      });
  } catch (err) {
    console.error(err);
    alert("Kunde inte lägga till venue");
  }
}

function deleteVenue() {
  const id = currentEditingStoreId;
  try {    fetch("/delete-venue", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte ta bort venue");
        return res.json();
      })
      .then((data) => {
        alert("Venue borttagen!");
        toggleEditScreen(); // Close the edit screen
        loadVenues();
      })
      .catch((err) => {
        console.error(err);
        alert("Kunde inte ta bort venue");
      });
  } catch (err) {
    console.error(err);
    alert("Kunde inte ta bort venue");
  }
}

function editVenue() {
  const name = document.getElementById("editVenueName").value;
  const district = document.getElementById("editVenueArea").value;
  const url = document.getElementById("editVenueUrl").value;

  try {
    fetch("/edit-venue", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentEditingStoreId, name, district, url }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte lägga till venue");
        return res.json();
      })
      .then((data) => {
        alert("Venue Redigerad!");
        document.getElementById("editVenueName").value = "";
        document.getElementById("editVenueArea").value = "";
        document.getElementById("editVenueUrl").value = "";
        toggleEditScreen(); // Close the edit screen
        loadVenues();
      })
      .catch((err) => {
        console.error(err);
        alert("Kunde inte lägga till venue");
      });
  } catch (err) {
    console.error(err);
    alert("Kunde inte lägga till venue");
  }
}
