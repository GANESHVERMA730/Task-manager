const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const quoteBox = document.querySelector("#quote");
const newQuoteBtn = document.querySelector("#newQuote");
const dateTime = document.querySelector("#datetime");
const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="task-text ${task.completed ? "completed" : ""}" data-index="${index}">${task.text}</span>
      <button class="delete-btn" data-index="${index}">❌</button>
    `;

    taskList.appendChild(li);
  });

  updateStats();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    alert("Please enter a task!");
    return;
  }

  tasks.push({ text, completed: false });
  taskInput.value = "";
  renderTasks();
}

// 🔥 FIX — button event
addBtn.addEventListener("click", addTask);

// 🔥 Add task with Enter key
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Toggle & Delete
taskList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;

  if (e.target.classList.contains("task-text")) {
    tasks[index].completed = !tasks[index].completed;
  }

  if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
  }

  renderTasks();
});

// Stats
function updateStats() {
  totalTasks.textContent = `Total: ${tasks.length}`;
  completedTasks.textContent = `Completed: ${tasks.filter(t => t.completed).length}`;
}

// Clock
setInterval(() => {
  dateTime.textContent = new Date().toLocaleString();
}, 1000);

// Quotes
async function getQuote() {
  newQuoteBtn.disabled = true;
  newQuoteBtn.textContent = "Loading...";

  try {
    const res = await fetch("https://api.quotable.io/random?maxLength=100");
    const data = await res.json();
    quoteBox.textContent = `"${data.content}" — ${data.author}`;
  } catch {
    quoteBox.textContent = "Stay positive and keep working hard 💪";
  } finally {
    newQuoteBtn.disabled = false;
    newQuoteBtn.textContent = "New Quote";
  }
}

newQuoteBtn.addEventListener("click", getQuote);
window.addEventListener("load", () => {
  renderTasks();
  getQuote();
});