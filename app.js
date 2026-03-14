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


// 🔥 PASTE YOUR FIREBASE CONFIG HERE
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
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.email);

        const loginBtn = document.querySelector(".login-btn");
        if (loginBtn) {
            loginBtn.innerText = "Logged in as " + user.displayName;
            loginBtn.style.background = "#22c55e";
        }
    }
});


// UI Elements
const loginBtn = document.getElementById("loginBtn");
const noteInput = document.getElementById("noteInput");
saveBtn.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first");
        return;
    }

    const textarea = document.querySelector("textarea");
    const text = textarea.value.trim();

    if (!text) {
        alert("Write something first");
        return;
    }

    try {
        await push(ref(db, "notes/" + user.uid), {
            text: text,
            createdAt: Date.now()
        });

        textarea.value = "";
        alert("Note saved!");

    } catch (error) {
        console.error(error);
    }

});
const notesDiv = document.getElementById("notes");

let currentUser;


// Google Login
loginBtn.onclick = async () => {
    await signInWithPopup(auth, provider);
};


// Detect logged in user
onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        loadNotes();

    }

});


// Save note
saveBtn.onclick = () => {

    const text = noteInput.value;

    if (text === "") return;

    push(ref(db, "notes/" + currentUser.uid), {

        content: text,
        time: Date.now()

    });

    noteInput.value = "";

};


// Load notes
function loadNotes() {

    const notesRef = ref(db, "notes/" + currentUser.uid);

    onValue(notesRef, (snapshot) => {

        notesDiv.innerHTML = "";

        snapshot.forEach(child => {

            const div = document.createElement("div");

            div.className = "note";

            div.innerText = child.val().content;

            notesDiv.appendChild(div);

        });

    });

}