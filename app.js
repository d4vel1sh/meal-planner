// ----- The data -----
// Everything the app remembers lives in one object called "plan":
// {
//   likes:   ["Chicken", "Pasta"],              the ticked food types
//   week:    { Monday: "m1", Tuesday: null },   which meal id is on each day
//   myMeals: [{ id, name, tags, ingredients }], meals the person added
//   ticked:  ["rice"]                           shopping items already bought
// }
// The built-in meals come from meals.js (MEALS and TAGS).

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const STORAGE_KEY = "meal-planner";

let plan = loadPlan();

function emptyPlan() {
  const week = {};
  for (const day of DAYS) week[day] = null;
  return { likes: [], week, myMeals: [], ticked: [] };
}

// Read the saved plan from the browser's storage, or start empty.
function loadPlan() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    // Storage blocked or broken: just start fresh.
  }
  if (!saved) return emptyPlan();

  // The first version saved typed-in meals as a list. Keep them by turning
  // each one into a "my meal" and putting it back on its day.
  if (Array.isArray(saved.meals)) {
    const upgraded = emptyPlan();
    saved.meals.forEach((old, i) => {
      const id = "c-old-" + i;
      upgraded.myMeals.push({ id, name: old.name, tags: [], ingredients: old.ingredients || [] });
      if (upgraded.week[old.day] === null) upgraded.week[old.day] = id;
    });
    upgraded.ticked = saved.ticked || [];
    return upgraded;
  }

  return { ...emptyPlan(), ...saved };
}

// Save the plan so it's still there next time the page opens.
function savePlan() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (e) {
    // If saving fails the app still works, it just won't remember.
  }
}

// ----- Finding meals -----

// Built-in meals plus the person's own, in one list.
function allMeals() {
  return [...plan.myMeals, ...MEALS];
}

function findMeal(id) {
  return allMeals().find(m => m.id === id) || null;
}

// Meals that match at least one thing the person likes.
// Nothing ticked means everything is allowed.
function matchingMeals() {
  if (plan.likes.length === 0) return allMeals();
  return allMeals().filter(m => m.tags.some(tag => plan.likes.includes(tag)));
}

// Pick a random meal for a day, avoiding meals already in the week if we can.
function pickMealFor(day) {
  const options = matchingMeals();
  const used = Object.entries(plan.week)
    .filter(([d, id]) => d !== day && id)
    .map(([, id]) => id);
  const fresh = options.filter(m => !used.includes(m.id) && m.id !== plan.week[day]);
  const pool = fresh.length > 0 ? fresh : options;
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

// ----- Building the shopping list -----
// Go through each day's meal, collect the ingredients, and count repeats.
// "onion" in three meals becomes one line: "onion ×3".
function buildShoppingList() {
  const counts = {};
  for (const day of DAYS) {
    const meal = findMeal(plan.week[day]);
    if (!meal) continue;
    for (const item of meal.ingredients) {
      const key = item.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return Object.keys(counts).sort().map(name => ({ name, count: counts[name] }));
}

// ----- Drawing the page -----
// Every time something changes we save, then redraw everything from "plan".

function update() {
  savePlan();
  render();
}

// A row of tick-able buttons ("chips"), used for likes and for tagging a new meal.
function renderChips(container, selected, onToggle) {
  container.innerHTML = "";
  for (const tag of TAGS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = tag;
    chip.setAttribute("aria-pressed", selected.includes(tag));
    chip.onclick = () => onToggle(tag);
    container.appendChild(chip);
  }
}

function toggle(list, item) {
  const i = list.indexOf(item);
  if (i === -1) list.push(item);
  else list.splice(i, 1);
}

const likesEl = document.getElementById("likes");
const weekEl = document.getElementById("week");
const listEl = document.getElementById("shopping-list");
const emptyEl = document.getElementById("empty-list");
const myMealsEl = document.getElementById("my-meals");
const tagsEl = document.getElementById("meal-tags");

let newMealTags = []; // tags ticked in the "Add your own meal" form

function render() {
  renderChips(likesEl, plan.likes, tag => { toggle(plan.likes, tag); update(); });
  renderChips(tagsEl, newMealTags, tag => { toggle(newMealTags, tag); render(); });
  renderWeek();
  renderShoppingList();
  renderMyMeals();
}

function renderWeek() {
  weekEl.innerHTML = "";
  for (const day of DAYS) {
    const row = document.createElement("div");
    row.className = "day";

    const title = document.createElement("h3");
    title.textContent = day;

    // A dropdown with every meal, so people can choose a day's meal themselves.
    const select = document.createElement("select");
    select.setAttribute("aria-label", `Meal for ${day}`);
    select.add(new Option("Nothing planned", ""));
    addMealGroup(select, "My meals", plan.myMeals);
    addMealGroup(select, "Meal ideas", MEALS);
    select.value = plan.week[day] || "";
    select.onchange = () => { plan.week[day] = select.value || null; update(); };

    const swap = document.createElement("button");
    swap.type = "button";
    swap.className = "secondary small";
    swap.textContent = "Swap";
    swap.setAttribute("aria-label", `Swap ${day}'s meal`);
    swap.onclick = () => { plan.week[day] = pickMealFor(day); update(); };

    const controls = document.createElement("div");
    controls.className = "day-controls";
    controls.append(select, swap);
    row.append(title, controls);
    weekEl.appendChild(row);
  }
}

function addMealGroup(select, label, meals) {
  if (meals.length === 0) return;
  const group = document.createElement("optgroup");
  group.label = label;
  for (const meal of meals) group.appendChild(new Option(meal.name, meal.id));
  select.appendChild(group);
}

function renderShoppingList() {
  const items = buildShoppingList();
  listEl.innerHTML = "";
  emptyEl.hidden = items.length > 0;

  for (const item of items) {
    const li = document.createElement("li");
    const isTicked = plan.ticked.includes(item.name);
    if (isTicked) li.className = "done";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = isTicked;
    box.onchange = () => { toggle(plan.ticked, item.name); update(); };

    const label = document.createElement("label");
    const text = document.createElement("span");
    text.textContent = item.count > 1 ? `${item.name} ×${item.count}` : item.name;
    label.append(box, text);
    li.appendChild(label);
    listEl.appendChild(li);
  }
}

function renderMyMeals() {
  myMealsEl.innerHTML = "";
  if (plan.myMeals.length === 0) {
    myMealsEl.innerHTML = `<li class="muted">None yet.</li>`;
    return;
  }
  for (const meal of plan.myMeals) {
    const li = document.createElement("li");
    li.className = "meal";
    const name = document.createElement("span");
    name.textContent = meal.name; // textContent keeps typed text as plain text

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = "✕";
    remove.setAttribute("aria-label", `Delete ${meal.name}`);
    remove.onclick = () => {
      if (!confirm(`Delete "${meal.name}"?`)) return;
      plan.myMeals = plan.myMeals.filter(m => m !== meal);
      for (const day of DAYS) if (plan.week[day] === meal.id) plan.week[day] = null;
      update();
    };

    li.append(name, remove);
    myMealsEl.appendChild(li);
  }
}

// ----- Buttons and the form -----

document.getElementById("plan-week").addEventListener("click", () => {
  const note = document.getElementById("plan-note");
  if (matchingMeals().length === 0) {
    note.textContent = "No meals match yet. Try ticking something else.";
    return;
  }
  for (const day of DAYS) plan.week[day] = null; // start the week fresh
  for (const day of DAYS) plan.week[day] = pickMealFor(day);
  plan.ticked = [];
  note.textContent = "Done! Don't fancy something? Tap Swap or pick another meal.";
  update();
});

document.getElementById("clear-week").addEventListener("click", () => {
  if (!confirm("Clear this week's meals and shopping list?")) return;
  for (const day of DAYS) plan.week[day] = null;
  plan.ticked = [];
  update(); // likes and your own meals are kept
});

document.getElementById("meal-form").addEventListener("submit", event => {
  event.preventDefault(); // stop the browser reloading the page

  const name = document.getElementById("meal-name").value.trim();
  const ingredients = document.getElementById("meal-ingredients").value
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");
  if (!name) return;

  plan.myMeals.push({ id: "c" + Date.now(), name, tags: [...newMealTags], ingredients });
  newMealTags = [];
  event.target.reset();
  update();
});

render();
