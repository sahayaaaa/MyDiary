// ========================================
// MYDIARY - FIREBASE
// ========================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyBrTadGHHZx8IWpEEpbAcySOm50WukCxnQ",
    authDomain: "mydiary-a222c.firebaseapp.com",
    projectId: "mydiary-a222c",
    storageBucket: "mydiary-a222c.firebasestorage.app",
    messagingSenderId: "715735315474",
    appId: "1:715735315474:web:b4b1b20db37abdc41a94cb"
};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ========================================
// LOGIN
// ========================================

window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter your email and password!");
        return;
    }

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        await checkUserProfile(userCredential.user);

    } catch (error) {

        alert(error.message);

    }
};


// ========================================
// GOOGLE LOGIN
// ========================================

window.googleLogin = async function () {

    const provider = new GoogleAuthProvider();

    try {

        const result =
            await signInWithPopup(auth, provider);

        await checkUserProfile(result.user);

    } catch (error) {

        alert(error.message);

    }
};


// ========================================
// SIGNUP
// ========================================

window.showSignup = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {

        alert("Enter your email and password first!");
        return;

    }

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // New user → Create Profile
        window.location.href =
            "profile-setup.html";

    } catch (error) {

        alert(error.message);

    }
};


// ========================================
// CHECK USER PROFILE
// ========================================

async function checkUserProfile(user) {

    const userDoc = doc(
        db,
        "users",
        user.uid
    );

    const profile =
        await getDoc(userDoc);


    if (profile.exists()) {

        // Existing user
        window.location.href =
            "home.html";

    } else {

        // New user
        window.location.href =
            "profile-setup.html";

    }
}


// ========================================
// SAVE PROFILE
// ========================================

window.saveProfile = async function () {

    const user = auth.currentUser;

    if (!user) {

        alert("Please login first!");
        window.location.href = "index.html";
        return;

    }


    const name =
        document.getElementById("name").value.trim();

    const bio =
        document.getElementById("bio").value.trim();

    const interests =
        document
            .getElementById("interests")
            .value
            .trim();


    if (!name) {

        alert("Please enter your name!");
        return;

    }


    try {

        await setDoc(
            doc(db, "users", user.uid),
            {
                name: name,
                bio: bio,
                interests: interests,
                email: user.email,
                createdAt: new Date()
            }
        );

        alert("Profile created! 🌌✨");

        window.location.href =
            "home.html";

    } catch (error) {

        alert(error.message);

    }

};


// ========================================
// AUTH STATE
// ========================================

onAuthStateChanged(auth, async (user) => {

    const currentPage =
        window.location.pathname.split("/").pop();


    // Not logged in
    if (
        !user &&
        (
            currentPage === "home.html" ||
            currentPage === "profile-setup.html"
        )
    ) {

        window.location.href =
            "index.html";

        return;

    }


    // Logged in on login page
    if (
        user &&
        (
            currentPage === "index.html" ||
            currentPage === ""
        )
    ) {

        await checkUserProfile(user);

        return;

    }


    // Load profile on home
    if (
    user &&
    currentPage === "home.html"
) {

    loadProfile(user);
    loadProfileActivity(user);

}

if (user && currentPage === "notes.html") {

    loadAllNotes(user);

}
if (user && currentPage === "diary.html") {

    loadAllDiary(user);

}
if (user && currentPage === "edit-note.html") {

    loadNoteForEditing();

}
if (user && currentPage === "edit-diary.html") {
    loadDiaryForEditing();
}

});


// ========================================
// LOAD PROFILE
// ========================================

async function loadProfile(user) {

    const userDoc = doc(
        db,
        "users",
        user.uid
    );

    const profile =
        await getDoc(userDoc);


    if (!profile.exists()) {
        window.location.href =
            "profile-setup.html";

        return;
    }


    const data = profile.data();


    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileBio =
    document.getElementById("profileBio");

const profileInterests =
    document.getElementById("profileInterests");

    if (profileName) {
        profileName.textContent =
            data.name;
    }


    if (profileEmail) {
        profileEmail.textContent =
            data.email;
    }
    if (profileBio) {
    profileBio.textContent =
        data.bio || "No bio added yet";
}

if (profileInterests) {
    profileInterests.textContent =
        data.interests || "No interests added yet";
}

}


// ========================================
// NAVIGATION
// ========================================

window.showSection = function (sectionName) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove("active");
        });


    const selectedSection =
        document.getElementById(
            sectionName + "Section"
        );


    if (selectedSection) {
        selectedSection.classList.add("active");
    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {
            button.classList.remove("active");
        });


    const navButtons =
        document.querySelectorAll(".nav-btn");


    if (sectionName === "home") {
    navButtons[0]?.classList.add("active");
}

else if (sectionName === "favorites") {
    navButtons[1]?.classList.add("active");
}

else if (sectionName === "create") {
    navButtons[2]?.classList.add("active");
}

else if (sectionName === "profile") {
    navButtons[3]?.classList.add("active");
}

};


// ========================================
// CREATE
// ========================================

window.showCreate = function () {
    window.showSection("create");
};


// ========================================
// LOGOUT
// ========================================

window.logout = async function () {

    try {

        await signOut(auth);

        window.location.href =
            "index.html";

    } catch (error) {

        alert(error.message);

    }

};
// ========================================
// EDIT PROFILE
// ========================================

window.editProfile = async function () {

    const user = auth.currentUser;

    if (!user) return;

    try {

        const userDoc = doc(
            db,
            "users",
            user.uid
        );

        const profile = await getDoc(userDoc);

        if (profile.exists()) {

            const data = profile.data();

            // Fill current values
            document.getElementById("editName").value =
                data.name || "";

            document.getElementById("editBio").value =
                data.bio || "";

            document.getElementById("editInterests").value =
                data.interests || "";

        }

        // Show form
        document
            .getElementById("editProfileForm")
            .classList.add("active");

    } catch (error) {

        alert(error.message);

    }

};


// ========================================
// UPDATE PROFILE
// ========================================

window.updateProfile = async function () {

    const user = auth.currentUser;

    if (!user) return;


    const name =
        document.getElementById("editName").value.trim();

    const bio =
        document.getElementById("editBio").value.trim();

    const interests =
        document
            .getElementById("editInterests")
            .value
            .trim();


    if (!name) {

        alert("Please enter your name!");
        return;

    }


    try {

        await setDoc(
            doc(db, "users", user.uid),
            {
                name: name,
                bio: bio,
                interests: interests,
                email: user.email
            },
            { merge: true }
        );


        // Update screen immediately
        document.getElementById("profileName").textContent =
            name;

        document.getElementById("profileBio").textContent =
            bio || "No bio added yet";

        document.getElementById("profileInterests").textContent =
            interests || "No interests added yet";


        // Hide form
        document
            .getElementById("editProfileForm")
            .classList.remove("active");


        alert("Profile updated! 💙✨");

    } catch (error) {

        alert(error.message);

    }

};


// ========================================
// CANCEL EDIT
// ========================================

window.cancelEditProfile = function () {

    document
        .getElementById("editProfileForm")
        .classList.remove("active");

};
// ========================================
// NOTES
// ========================================

// Open Note Form

window.openNoteForm = function () {

    document
        .getElementById("noteForm")
        .classList.add("active");

};


// Close Note Form

window.closeNoteForm = function () {

    document
        .getElementById("noteForm")
        .classList.remove("active");

};


// Save Note

window.saveNote = async function () {

    const user = auth.currentUser;

    if (!user) {

        alert("Please login first!");
        return;

    }


    const title =
        document
            .getElementById("noteTitle")
            .value
            .trim();


    const content =
        document
            .getElementById("noteContent")
            .value
            .trim();


    if (!title || !content) {

        alert("Please enter a title and note!");
        return;

    }


    try {

        await addDoc(
            collection(
                db,
                "users",
                user.uid,
                "notes"
            ),
            {

                title: title,
                content: content,

                createdAt: new Date(),

                favorite: false

            }
        );


        alert("Note saved! 📝💙");


        // Clear form

        document
            .getElementById("noteTitle")
            .value = "";


        document
            .getElementById("noteContent")
            .value = "";


        // Go back to Home page

window.location.href = "home.html";


    } catch (error) {

        alert(error.message);

    }

};
// ========================================
// LOAD SAVED NOTES
// ========================================

async function loadNotes(user) {

    const notesContainer =
        document.getElementById("notesContainer");

    if (!notesContainer) {
        console.log("Notes container not found");
        return;
    }

    try {

        const notesRef = collection(
            db,
            "users",
            user.uid,
            "notes"
        );

        const snapshot =
            await getDocs(notesRef);

        console.log("Number of notes:", snapshot.size);


        // If no notes exist

        if (snapshot.empty) {

            notesContainer.innerHTML = `
                <div class="empty-state">

                    <div class="empty-icon">🌌</div>

                    <h3>Your universe is waiting</h3>

                    <p>
                        Start creating your first note!
                    </p>

                    <button onclick="showCreate()">
                        Create something ✨
                    </button>

                </div>
            `;

            return;

        }
// ========================================
// DELETE NOTE
// ========================================

window.deleteNote = async function (noteId) {

    const user = auth.currentUser;

    if (!user) return;


    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;


    try {

        await deleteDoc(
            doc(
                db,
                "users",
                user.uid,
                "notes",
                noteId
            )
        );


        alert("Note deleted! 🗑️");


        // Reload notes
        loadNotes(user);


    } catch (error) {

        console.error(error);

        alert("Error deleting note: " + error.message);

    }

};

        // Clear old content

        notesContainer.innerHTML = "";


        // Show every saved note

        snapshot.forEach((noteDoc) => {

            const note =
                noteDoc.data();


            const noteCard =
                document.createElement("div");

            noteCard.className =
                "saved-note-card";


            noteCard.innerHTML = `

    <div class="note-card-top">

        <span class="note-icon">
            📝
        </span>

        <h3>
            ${note.title}
        </h3>

    </div>


    <p class="note-preview">
        ${note.content}
    </p>


    <div class="note-actions">

        <button
            class="edit-note-btn"
            onclick="editNote('${noteDoc.id}')"
        >
            ✏️ Edit
        </button>


        <button
            class="delete-note-btn"
            onclick="deleteNote('${noteDoc.id}')"
        >
            🗑️ Delete
        </button>

    </div>

`;


            notesContainer.appendChild(noteCard);

        });

    } catch (error) {

        console.error(
            "Error loading notes:",
            error
        );

    }

}
// ========================================
// EDIT NOTE - OPEN EDIT PAGE
// ========================================

window.editNote = function (noteId) {

    window.location.href =
        "edit-note.html?id=" + noteId;

};


// ========================================
// LOAD NOTE FOR EDITING
// ========================================

async function loadNoteForEditing() {

    const params =
        new URLSearchParams(window.location.search);

    const noteId =
        params.get("id");


    // Only run on edit-note page

    if (!noteId) return;


    const user = auth.currentUser;

    if (!user) return;


    try {

        const noteDoc =
            await getDoc(
                doc(
                    db,
                    "users",
                    user.uid,
                    "notes",
                    noteId
                )
            );


        if (!noteDoc.exists()) {

            alert("Note not found!");
            window.location.href = "home.html";
            return;

        }


        const note =
            noteDoc.data();


        document
            .getElementById("editNoteTitle")
            .value = note.title || "";


        document
            .getElementById("editNoteContent")
            .value = note.content || "";


    } catch (error) {

        console.error(error);
        alert("Error loading note!");

    }

}


// ========================================
// SAVE EDITED NOTE
// ========================================

window.saveEditedNote = async function () {

    const params =
        new URLSearchParams(window.location.search);

    const noteId =
        params.get("id");


    const user = auth.currentUser;

    if (!user || !noteId) return;


    const title =
        document
            .getElementById("editNoteTitle")
            .value
            .trim();


    const content =
        document
            .getElementById("editNoteContent")
            .value
            .trim();


    if (!title || !content) {

        alert("Please enter a title and note!");
        return;

    }


    try {

        await updateDoc(
            doc(
                db,
                "users",
                user.uid,
                "notes",
                noteId
            ),
            {

                title: title,
                content: content

            }
        );


        alert("Note updated! 💙✨");


        window.location.href =
            "home.html";


    } catch (error) {

        console.error(error);

        alert(
            "Error updating note: " +
            error.message
        );

    }

};
// ========================================
// LOAD ALL NOTES PAGE
// ========================================

async function loadAllNotes(user) {

    const container =
        document.getElementById("allNotesContainer");

    if (!container) return;


    try {

        const notesRef = collection(
            db,
            "users",
            user.uid,
            "notes"
        );

        const snapshot =
            await getDocs(notesRef);


        // No notes

        if (snapshot.empty) {

            container.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📝
                    </div>

                    <h3>No notes yet</h3>

                    <p>
                        Create your first note!
                    </p>

                </div>

            `;

            return;

        }


        // Clear loading message

        container.innerHTML = "";


        // Display all notes

        snapshot.forEach((noteDoc) => {

            const note =
                noteDoc.data();


            const noteCard =
                document.createElement("div");

            noteCard.className =
                "saved-note-card";


            noteCard.innerHTML = `

                <div class="note-card-top">

                    <span class="note-icon">
                        📝
                    </span>

                    <h3>
                        ${note.title}
                    </h3>

                </div>


                <p class="note-preview">
                    ${note.content}
                </p>


                <div class="note-actions">

                    <button
                        class="edit-note-btn"
                        onclick="editNote('${noteDoc.id}')"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-note-btn"
                        onclick="deleteNote('${noteDoc.id}')"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            container.appendChild(noteCard);

        });


    } catch (error) {

        console.error(
            "Error loading notes:",
            error
        );

        container.innerHTML = `
            <p class="loading-text">
                Error loading notes 😢
            </p>
        `;

    }

}
// ========================================
// SAVE DIARY ENTRY
// ========================================

window.saveDiary = async function () {

    const user = auth.currentUser;

    if (!user) {

        alert("Please login first!");
        return;

    }


    const date =
        document
            .getElementById("diaryDate")
            .value;


    const title =
        document
            .getElementById("diaryTitle")
            .value
            .trim();


    const content =
        document
            .getElementById("diaryContent")
            .value
            .trim();


    if (!date || !content) {

        alert("Please select a date and write something!");
        return;

    }


    try {

        await addDoc(
            collection(
                db,
                "users",
                user.uid,
                "diary"
            ),
            {

                date: date,

                title: title || "Dear Diary",

                content: content,

                createdAt: new Date()

            }
        );


        alert("Diary entry saved! 📔💙");


        window.location.href =
            "home.html";


    } catch (error) {

        console.error(error);

        alert(
            "Error saving diary: " +
            error.message
        );

    }

};
// ========================================
// LOAD ALL DIARY ENTRIES
// ========================================

async function loadAllDiary(user) {

    const container =
        document.getElementById("allDiaryContainer");

    if (!container) return;

    try {

        const diaryRef = collection(
            db,
            "users",
            user.uid,
            "diary"
        );

        const snapshot =
            await getDocs(diaryRef);


        // No diary entries yet
        if (snapshot.empty) {

            container.innerHTML = `
                <div class="empty-state">

                    <div class="empty-icon">
                        📔
                    </div>

                    <h3>Your diary is waiting</h3>

                    <p>
                        Start writing your memories.
                    </p>

                </div>
            `;

            return;

        }


        // Clear loading message
        container.innerHTML = "";


        // Show every diary entry
        snapshot.forEach((diaryDoc) => {

            const entry =
                diaryDoc.data();


            const entryCard =
                document.createElement("div");

            entryCard.className =
                "diary-entry-card";


            entryCard.innerHTML = `

    <div class="diary-entry-date">
        📅 ${entry.date}
    </div>

    <h2>
        ${entry.title}
    </h2>

    <p>
        ${entry.content}
    </p>


    <div class="note-actions">

        <button
            class="edit-note-btn"
            onclick="editDiary('${diaryDoc.id}')"
        >
            ✏️ Edit
        </button>


        <button
            class="delete-note-btn"
            onclick="deleteDiary('${diaryDoc.id}')"
        >
            🗑️ Delete
        </button>

    </div>

`;


            container.appendChild(entryCard);

        });


    } catch (error) {

        console.error(
            "Error loading diary:",
            error
        );

        container.innerHTML = `
            <p class="loading-text">
                Error opening diary 😢
            </p>
        `;

    }

}
// ========================================
// DELETE DIARY ENTRY
// ========================================

window.deleteDiary = async function (diaryId) {

    const user = auth.currentUser;

    if (!user) return;


    const confirmDelete = confirm(
        "Are you sure you want to delete this diary entry?"
    );

    if (!confirmDelete) return;


    try {

        await deleteDoc(
            doc(
                db,
                "users",
                user.uid,
                "diary",
                diaryId
            )
        );


        alert("Diary entry deleted! 🗑️");


        // Reload diary entries
        loadAllDiary(user);


    } catch (error) {

        console.error(error);

        alert(
            "Error deleting diary: " +
            error.message
        );

    }

};
// ========================================
// EDIT DIARY - OPEN EDIT PAGE
// ========================================

window.editDiary = function (diaryId) {

    window.location.href =
        "edit-diary.html?id=" + diaryId;

};
// ========================================
// LOAD DIARY FOR EDITING
// ========================================

async function loadDiaryForEditing() {

    const params =
        new URLSearchParams(window.location.search);

    const diaryId =
        params.get("id");


    if (!diaryId) return;


    const user = auth.currentUser;

    if (!user) return;


    try {

        const diaryDoc =
            await getDoc(
                doc(
                    db,
                    "users",
                    user.uid,
                    "diary",
                    diaryId
                )
            );


        if (!diaryDoc.exists()) {

            alert("Diary entry not found!");

            window.location.href =
                "diary.html";

            return;

        }


        const entry =
            diaryDoc.data();


        document
            .getElementById("editDiaryDate")
            .value = entry.date || "";


        document
            .getElementById("editDiaryTitle")
            .value = entry.title || "";


        document
            .getElementById("editDiaryContent")
            .value = entry.content || "";


    } catch (error) {

        console.error(error);

        alert("Error loading diary entry!");

    }

}


// ========================================
// SAVE EDITED DIARY
// ========================================

window.saveEditedDiary = async function () {

    const params =
        new URLSearchParams(window.location.search);

    const diaryId =
        params.get("id");


    const user = auth.currentUser;

    if (!user || !diaryId) return;


    const date =
        document
            .getElementById("editDiaryDate")
            .value;


    const title =
        document
            .getElementById("editDiaryTitle")
            .value
            .trim();


    const content =
        document
            .getElementById("editDiaryContent")
            .value
            .trim();


    if (!date || !content) {

        alert("Please select a date and write something!");

        return;

    }


    try {

        await updateDoc(
            doc(
                db,
                "users",
                user.uid,
                "diary",
                diaryId
            ),
            {
                date: date,

                title: title || "Dear Diary",

                content: content
            }
        );


        alert("Diary updated! 📔💙");


        window.location.href =
            "diary.html";


    } catch (error) {

        console.error(error);

        alert(
            "Error updating diary: " +
            error.message
        );

    }

};
// ========================================
// LOAD PROFILE ACTIVITY
// ========================================

async function loadProfileActivity(user) {

    try {

        // NOTES COUNT

        const notesSnapshot =
            await getDocs(
                collection(
                    db,
                    "users",
                    user.uid,
                    "notes"
                )
            );


        const notesCount =
            document.getElementById("notesCount");

        if (notesCount) {

            notesCount.textContent =
                notesSnapshot.size;

        }


        // DIARY COUNT

        const diarySnapshot =
            await getDocs(
                collection(
                    db,
                    "users",
                    user.uid,
                    "diary"
                )
            );


        const diariesCount =
            document.getElementById("diariesCount");

        if (diariesCount) {

            diariesCount.textContent =
                diarySnapshot.size;

        }


        // FAVORITES - for later

        const favoritesCount =
            document.getElementById("favoritesCount");

        if (favoritesCount) {

            favoritesCount.textContent = "0";

        }


        // PLANS - for later

        const plansCount =
            document.getElementById("plansCount");

        if (plansCount) {

            plansCount.textContent = "0";

        }


    } catch (error) {

        console.error(
            "Error loading activity:",
            error
        );

    }

}