// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getDatabase,
    ref,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCKAZtSquUmYLdTbXahx14ZZTqoSHT8TdQ",
    authDomain: "ai-notes-saver-8c93b.firebaseapp.com",
    projectId: "ai-notes-saver-8c93b",
    storageBucket: "ai-notes-saver-8c93b.firebasestorage.app",
    messagingSenderId: "1092026372802",
    appId: "1:1092026372802:web:3c63b75f31830cdde1e15b",
    measurementId: "G-2NPQ65YMRM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();


// UI Elements
const loginBtn = document.getElementById("loginBtn");
const saveBtn = document.getElementById("saveNote");
const noteInput = document.getElementById("noteInput");
const notesContainer = document.getElementById("notes");

let currentUser = null;


// Google Login
loginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("Logged in:", user.email);
        loginBtn.innerText = "Logged in as " + user.displayName;

    } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
    }
});


// Detect login state
onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;
        loginBtn.innerText = "Logged in as " + user.displayName;

        const notesRef = ref(db, "notes/" + user.uid);

        onValue(notesRef, (snapshot) => {

            notesContainer.innerHTML = "";

            snapshot.forEach((child) => {

                const noteText = child.val().text;

                const note = document.createElement("div");
                note.className = "note";
                note.innerText = noteText;

                notesContainer.appendChild(note);

            });

        });

    }

});


// Save Note
saveBtn.addEventListener("click", async () => {

    if (!currentUser) {
        alert("Please login first");
        return;
    }

    const text = noteInput.value.trim();

    if (text === "") {
        alert("Write a note first!");
        return;
    }

    const notesRef = ref(db, "notes/" + currentUser.uid);

    await push(notesRef, {
        text: text,
        createdAt: Date.now()
    });

    noteInput.value = "";

});