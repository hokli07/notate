const titleInput = document.getElementById("title");
const textInput = document.getElementById("text");
const addBtn = document.getElementById("addBtn");
const notesDiv = document.getElementById("notes");

let notes = [];

// Перевірка підтримки localStorage (MDN)
function storageAvailable(type) {
    let storage;

    try {
        storage = window[type];

        const x = "__storage_test__";

        storage.setItem(x, x);
        storage.removeItem(x);

        return true;
    } catch (e) {
        return false;
    }
}

// Завантаження нотаток
if (storageAvailable("localStorage")) {

    const savedNotes = localStorage.getItem("notes");

    if (savedNotes !== null) {
        notes = JSON.parse(savedNotes);
    }

} else {
    alert("Ваш браузер не підтримує localStorage.");
}

// Відобразити нотатки після запуску
renderNotes();

// Додавання нотатки
addBtn.addEventListener("click", function () {

    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    if (title === "" || text === "") {
        alert("Заповніть усі поля!");
        return;
    }

    const now = new Date();

    const note = {
        id: Date.now(),
        title: title,
        text: text,
        date: now.toLocaleString("uk-UA"),
        archived: false
    };

    notes.push(note);

    saveNotes();

    renderNotes();

    titleInput.value = "";
    textInput.value = "";

});

// Збереження нотаток
function saveNotes() {

    if (storageAvailable("localStorage")) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

}

// Відображення
function renderNotes() {

    notesDiv.innerHTML = "";

    notes.forEach(function (note) {

        const card = document.createElement("div");
        card.classList.add("note");

        if (note.archived) {
            card.classList.add("archived");
        }

        card.innerHTML = `
            <h2>${note.title}</h2>

            <p>${note.text}</p>

            <div class="date">
                📅 ${note.date}
            </div>

            <div class="buttons">

                <button class="archiveBtn">
                    ${note.archived ? "Розархівувати" : "Архівувати"}
                </button>

                <button class="editBtn">
                    Редагувати
                </button>

                ${
                    note.archived
                        ? '<button class="deleteBtn">Видалити</button>'
                        : ""
                }

            </div>
        `;

        // Архівування
        card.querySelector(".archiveBtn").addEventListener("click", function () {

            note.archived = !note.archived;

            saveNotes();

            renderNotes();

        });

        // Редагування
        card.querySelector(".editBtn").addEventListener("click", function () {

            const newTitle = prompt("Новий заголовок:", note.title);

            if (newTitle === null) return;

            const newText = prompt("Новий текст:", note.text);

            if (newText === null) return;

            note.title = newTitle;
            note.text = newText;

            saveNotes();

            renderNotes();

        });

        // Видалення
        if (note.archived) {

            card.querySelector(".deleteBtn").addEventListener("click", function () {

                const answer = confirm("Видалити нотатку?");

                if (answer) {

                    notes = notes.filter(function (item) {
                        return item.id !== note.id;
                    });

                    saveNotes();

                    renderNotes();

                }

            });

        }

        notesDiv.appendChild(card);

    });

}