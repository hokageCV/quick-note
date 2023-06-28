let notes = [];

document.addEventListener("DOMContentLoaded", (event) => {
  if (localStorage.getItem("notes")) {
    notes = JSON.parse(localStorage.getItem("notes"));
  }
  renderNotes(notes);

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.querySelector("textarea").value;
    addNote(notes, note);
  });

  document.querySelector("#btnLearn").addEventListener("click", (event) => {
    location.href = "https://frontendmasters.com";
  });

  let bipEvent = null; // beforeinstallprompt` event

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    bipEvent = event;
  });

  document.querySelector("#btnInstall").addEventListener("click", (event) => {
    if (bipEvent) {
      bipEvent.prompt();
    } else {
      // incompatible browser, PWA is not passing the criteria, the user has already installed the PWA
      alert("To install the app look for Add to Homescreen or Install in your browser's menu");
    }
  });

  document.querySelector("#btnShare").addEventListener("click", (event) => {
    let notesString = "";
    for (let note of notes) {
      notesString += note + " | ";
    }
    navigator.share({
      title: "Quick Note",
      text: notesString,
    });
  });
});

/**
 * @function renderNotes - Renders the notes on the page
 * @param {string[]} notes - An array of notes to be rendered
 * @returns {void}
 */
function renderNotes(notes) {
  const notesList = document.querySelector("#notes");
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.innerHTML = note;

    const deleteButton = document.createElement("a");
    deleteButton.innerHTML = '<img src="./assets/icons/delete.png" class="icon" alt="Delete">';
    deleteButton.addEventListener("click", (e) => deleteNote(notes, index));

    li.appendChild(deleteButton);
    notesList.appendChild(li);
  });
}

// ====================================================

/**
 * @function save - Saves the notes array to localStorage
 * @returns {void}
 */
function save() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/**
 * @function addNote - Adds a note to the notes array, renders the updated notes on the page, and saves the notes array to localStorage
 * @param {string[]} notes - An array of notes to add the new note to
 * @param {string} note - The note to add to the notes array
 * @returns {void}
 */
function addNote(notes, note) {
  if (note.length == 0) {
    alert("You didn't input any content");
  } else {
    notes.push(note);
    renderNotes(notes);
    save();
    document.querySelector("textarea").value = "";
  }
}

/**
 * @function deleteNote - Deletes a note from the notes array at the specified index, renders the updated notes on the page, and saves the notes array to localStorage
 * @param {string[]} notes - An array of notes to delete a note from
 * @param {number} index - The index of the note to delete
 * @returns {void}
 */
function deleteNote(notes, index) {
  notes.splice(index, 1);
  renderNotes(notes);
  save();
}
