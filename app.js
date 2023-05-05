let notes = [];

/**
 * Handles the "DOMContentLoaded" event and sets up event listeners for the form submit button, the "Learn" button,
 * the "Install" button, and the "Share" button.
 * @param {Event} event - The "DOMContentLoaded" event.
 */
document.addEventListener("DOMContentLoaded", (event) => {
  if (localStorage.getItem("notes")) {
    notes = JSON.parse(localStorage.getItem("notes"));
  }
  renderNotes(notes);

  /**
   * Handles the "submit" event for the form element and adds a new note to the list of notes.
   * @param {Event} event - The "submit" event for the form element.
   */
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.querySelector("textarea").value;
    addNote(notes, note);
  });

  /**
   * Handles the "click" event for the "Learn" button and redirects the user to the Frontend Masters website.
   * @param {Event} event - The "click" event for the "Learn" button.
   */
  document.querySelector("#btnLearn").addEventListener("click", (event) => {
    location.href = "https://frontendmasters.com";
  });

  let bipEvent = null; // beforeinstallprompt` event

  /**
   * Handles the "beforeinstallprompt" event and sets the "bipEvent" variable to the event object.
   * @param {Event} event - The "beforeinstallprompt" event.
   */
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    bipEvent = event;
  });

  /**
   * Handles the "click" event for the "Install" button and prompts the user to install the app if the browser supports it,
   * or shows an alert message with instructions on how to install the app otherwise.
   * @param {Event} event - The "click" event for the "Install" button.
   */
  document.querySelector("#btnInstall").addEventListener("click", (event) => {
    if (bipEvent) {
      bipEvent.prompt();
    } else {
      // incompatible browser, your PWA is not passing the criteria, the user has already installed the PWA
      //TODO: show the user information on how to install the app
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
    deleteButton.innerHTML = '<span class="icon">delete</span>';
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
