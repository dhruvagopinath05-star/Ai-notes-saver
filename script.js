const saveBtn = document.getElementById("saveNote");
const noteInput = document.getElementById("noteInput");
const notesContainer = document.getElementById("notes");

saveBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();

    if (text === "") {
        alert("Write a note first!");
        return;
    }

    const note = document.createElement("div");
    note.className = "note";
    note.innerText = text;

    notesContainer.appendChild(note);

    noteInput.value = "";
});