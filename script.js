const cats = document.getElementById("categoryList");
const display = document.getElementById("commandDisplay");
const searchBar = document.getElementById("searchBar");
const permFilter = document.getElementById("permFilter");
const resetBtn = document.getElementById("resetButton");

let commandData = {};

async function loadCommands() {
  try {
    const res = await fetch("commands.json");
    commandData = await res.json();
    renderAll();
  } catch (err) {
    display.innerHTML = "<p>Error loading commands.</p>";
  }
}

function getPermClass(p) {
  const l = p.toLowerCase();
  if (l.includes("admin")) return "admin";
  if (l.includes("owner")) return "owner";
  if (l.includes("manage")) return "manage";
  if (l.includes("kick")) return "kick";
  if (l.includes("ban")) return "ban";
  if (l.includes("none")) return "none";
  return "";
}

function createTags(tags = []) {
  return tags.map(t => `<span class="tag-badge ${t}">${t}</span>`).join("");
}

function createCmdHTML(cmd) {
  return `<div class="command">
    <div class="command-name">${cmd.name}</div>
    <div class="command-desc">${cmd.desc}</div>
    <div>${createTags(cmd.tags)}</div>
    <div class="perm-badge ${getPermClass(cmd.perms)}">${cmd.perms}</div>
    ${cmd.note ? `<div class="command-note">${cmd.note}</div>` : ""}
  </div>`;
}

function renderAll() {
  display.innerHTML = "";
  const q = searchBar.value.trim().toLowerCase();
  const pf = permFilter.value;

  Object.entries(commandData).forEach(([cat, cmds]) => {
    // Filter commands by permission and search text
    const filtered = cmds.filter(c =>
      (!pf || c.perms === pf) &&
      (!q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    );
    if (filtered.length) {
      const block = document.createElement("div");
      block.className = "command-block";
      block.innerHTML = `<h2>${cat}</h2>` + filtered.map(createCmdHTML).join("");
      display.appendChild(block);
    }
  });
}

cats.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (!li) return;
  cats.querySelectorAll("li").forEach(el => el.classList.remove("active"));
  li.classList.add("active");
  searchBar.value = "";
  permFilter.value = "";
  const cat = li.dataset.category;
  display.innerHTML = `<div class="command-block"><h2>${cat}</h2>` +
    commandData[cat].map(createCmdHTML).join("") + "</div>";
});

searchBar.addEventListener("input", renderAll);
permFilter.addEventListener("change", renderAll);

resetBtn.addEventListener("click", () => {
  cats.querySelectorAll("li").forEach(el => el.classList.remove("active"));
  searchBar.value = "";
  permFilter.value = "";
  renderAll();
});

window.addEventListener("DOMContentLoaded", loadCommands);
