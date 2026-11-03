const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const STORAGE_KEY = "quicknotes_app_data";

let notes = loadNotes();
let searchQuery = "";

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render() {
  list.innerHTML = "";

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note-card", note.category);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("note-content");

    const textSpan = document.createElement("p");
    textSpan.textContent = note.text;

    const metaSpan = document.createElement("span");
    metaSpan.textContent = `Category: [${note.category}] | Created: ${note.createdAt}`;

    infoDiv.appendChild(textSpan);
    infoDiv.appendChild(metaSpan);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(infoDiv);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  // Dynamic count messages
  if (notes.length === 0) {
    count.textContent = "You have no notes.";
  } else if (notes.length === 1) {
    count.textContent = "You have 1 note.";
  } else {
    count.textContent = `You have ${notes.length} notes.`;
  }
}

function addNote(text, category) {
  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  saveNotes();
  render();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

// Form submission with validation
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const category = categorySelect.value;

  if (text === "") {
    errorMessage.textContent = "Error: Note text cannot be empty.";
    errorMessage.classList.remove("error-hidden");
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Error: Note exceeds 200 character limit.";
    errorMessage.classList.remove("error-hidden");
    return;
  }

  // Clear error if validation passes
  errorMessage.textContent = "";
  errorMessage.classList.add("error-hidden");

  addNote(text, category);
  input.value = "";
  input.focus();
});

// Search input listener
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  render();
});

// Initial load
render();
