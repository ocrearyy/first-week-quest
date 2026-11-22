const $ = (id) => document.getElementById(id);
const tracks = window.onboarding;
const storageKey = "first-week-quest:v1";
const icons = ["⌂", "♧", "◇", "⊞", "↗", "✦"];
const dialog = $("mission");
let saved;
try {
  saved = JSON.parse(localStorage.getItem(storageKey));
} catch {
  saved = null;
}
const completed = Object.fromEntries(Object.keys(tracks).map((key) => [
  key, new Set(Array.isArray(saved?.[key]) ? saved[key].filter((index) => Number.isInteger(index) && tracks[key].modules[index]) : [])
]));
let track = Object.hasOwn(tracks, saved?.track) ? saved.track : "bank";
let active = 0;
let checked = false;
let opener;

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      track,
      ...Object.fromEntries(Object.entries(completed).map(([key, values]) => [key, [...values]]))
    }));
  } catch {
    document.querySelector("footer span:last-child").textContent = "Progress is available for this visit.";
  }
}

function render() {
  const { company, team, modules } = tracks[track];
  $("track").value = track;
  $("welcome").textContent = `Welcome to ${company}. Meet the ${team} team, learn how work gets done, and practice your first decisions.`;
  const count = completed[track].size;
  $("count").textContent = `${count} of ${modules.length} missions complete`;
  $("progress").max = modules.length;
  $("progress").value = count;
  $("resume").firstChild.textContent = count === modules.length ? "Review journey " : count ? "Continue journey " : "Start journey ";
  $("cards").replaceChildren(...modules.map(([category, title, description], index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.index = index;
    card.innerHTML = '<span class="card-head"><span class="icon" aria-hidden="true"></span><span class="status"></span></span><span class="card-title"></span><span class="card-copy"></span>';
    const done = completed[track].has(index);
    card.querySelector(".icon").textContent = icons[index] || "✦";
    const status = card.querySelector(".status");
    status.textContent = done ? "✓ Complete" : category;
    status.classList.toggle("done", done);
    card.querySelector(".card-title").textContent = title;
    card.querySelector(".card-copy").textContent = description;
    card.addEventListener("click", () => openMission(index, card));
    return card;
  }));
}

function openMission(index, trigger) {
  active = index;
  opener = trigger;
  checked = false;
  const [category, title, , guide, brief, question, choices] = tracks[track].modules[index];
  $("mission-type").textContent = `Mission ${index + 1} · ${category}`;
  $("mission-title").textContent = title;
  $("guide").textContent = guide;
  $("brief").textContent = brief;
  $("question").textContent = question;
  $("feedback").textContent = "";
  $("feedback").className = "";
  $("action").textContent = "Check answer";
  $("choices").replaceChildren(...choices.map((choice, value) => {
    const label = document.createElement("label");
    label.className = "option";
    const radio = document.createElement("input");
    Object.assign(radio, { type: "radio", name: "answer", value, required: true });
    label.append(radio, document.createTextNode(choice));
    return label;
  }));
  if (!dialog.open) dialog.showModal();
  dialog.querySelector(".close").focus();
}

$("track").addEventListener("change", (event) => {
  track = event.target.value;
  save();
  render();
});
$("resume").addEventListener("click", () => {
  const index = tracks[track].modules.findIndex((_, position) => !completed[track].has(position));
  openMission(Math.max(0, index), $("resume"));
});
dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  const index = opener?.dataset.index;
  render();
  (index === undefined ? $("resume") : document.querySelector(`[data-index="${index}"]`))?.focus();
});
$("form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (checked) {
    const next = tracks[track].modules.findIndex((_, index) => !completed[track].has(index));
    if (next < 0) dialog.close();
    else openMission(next, opener);
    return;
  }
  const [, , , , , , , correct, explanation] = tracks[track].modules[active];
  const answer = new FormData(event.currentTarget).get("answer");
  if (Number(answer) !== correct) {
    $("feedback").textContent = "Try again. Revisit the briefing above and choose another answer.";
    return;
  }
  checked = true;
  completed[track].add(active);
  save();
  render();
  const finished = completed[track].size === tracks[track].modules.length;
  $("feedback").className = "success";
  $("feedback").textContent = `Correct! ${explanation}${finished ? " First-week milestone earned." : ""}`;
  $("action").textContent = finished ? "Back to journey" : "Next mission";
  $("action").focus();
  $("choices").querySelectorAll("input").forEach((input) => { input.disabled = true; });
});
render();
