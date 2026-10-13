// ----- The data -----
// Everything the app knows lives in one object called "plan".
// It looks like: { meals: [{ day, name, ingredients: [...] }], ticked: ["rice", ...] }

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const STORAGE_KEY = "meal-planner";

let plan = loadPlan();

// Read the saved plan from the browser's storage, or start empty.
function loadPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.meals)) return saved;
  } catch (e) {
    // Storage blocked or broken: just start fresh.
  }
  return { meals: [], ticked: [] };
}

// Save the plan so it's still there next time the page opens.
function savePlan() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (e) {
    // If saving fails the app still works, it just won't remember.
  }
}

// ----- Building the shopping list -----
// Go through every meal, collect the ingredients, and count repeats.
// "eggs" in two meals becomes one line: "eggs ×2".
function buildShoppingList() {
  const counts = {};
  for (const meal of plan.meals) {
    for (const item of meal.ingredients) {
      const key = item.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return Object.keys(counts).sort().map(name => ({ name, count: counts[name] }));
}

// ----- Drawing the page -----
// Every time something changes we redraw the week and the list from "plan".

const weekEl = document.getElementById("week");
const listEl = document.getElementById("shopping-list");
const emptyEl = document.getElementById("empty-list");

function render() {
  // The week
  weekEl.innerHTML = "";
  for (const day of DAYS) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.innerHTML = `<h3>${day}</h3>`;

    const mealsToday = plan.meals.filter(m => m.day === day);
    if (mealsToday.length === 0) {
      dayEl.insertAdjacentHTML("beforeend", `<p class="muted">Nothing planned</p>`);
    }
    for (const meal of mealsToday) {
      const row = document.createElement("div");
      row.className = "meal";
      row.textContent = meal.name; // textContent keeps typed text as plain text

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove";
      removeBtn.textContent = "✕";
      removeBtn.setAttribute("aria-label", `Remove ${meal.name}`);
      removeBtn.onclick = () => {
        plan.meals.splice(plan.meals.indexOf(meal), 1);
        savePlan();
        render();
      };

      row.appendChild(removeBtn);
      dayEl.appendChild(row);
    }
    weekEl.appendChild(dayEl);
  }

  // The shopping list
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
    box.onchange = () => {
      if (box.checked) plan.ticked.push(item.name);
      else plan.ticked = plan.ticked.filter(n => n !== item.name);
      savePlan();
      render();
    };

    const label = document.createElement("label");
    const text = document.createElement("span");
    text.textContent = item.count > 1 ? `${item.name} ×${item.count}` : item.name;
    label.append(box, text);
    li.appendChild(label);
    listEl.appendChild(li);
  }
}

// ----- Handling the form and buttons -----

// Fill the "Day" dropdown with the days of the week.
const daySelect = document.getElementById("meal-day");
for (const day of DAYS) {
  daySelect.add(new Option(day, day));
}

document.getElementById("meal-form").addEventListener("submit", event => {
  event.preventDefault(); // stop the browser reloading the page

  const name = document.getElementById("meal-name").value.trim();
  const ingredients = document.getElementById("meal-ingredients").value
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  if (!name) return;

  plan.meals.push({ day: daySelect.value, name, ingredients });
  savePlan();
  render();

  // Clear the boxes, and move on to the next day to save a tap.
  event.target.reset();
  const nextDay = DAYS[(DAYS.indexOf(plan.meals.at(-1).day) + 1) % DAYS.length];
  daySelect.value = nextDay;
});

document.getElementById("clear-week").addEventListener("click", () => {
  if (confirm("Clear all meals and start a new week?")) {
    plan = { meals: [], ticked: [] };
    savePlan();
    render();
  }
});

render();
