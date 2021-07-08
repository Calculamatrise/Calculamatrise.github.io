const params = new URLSearchParams(location.search);
const room_id = params.get("room");
firebase.initializeApp({
    apiKey: "AIzaSyDVnRMClAPCDp2b3N_iAISRbInKIC80Y6w",
    authDomain: "calculamatrise.firebaseapp.com",
    projectId: "calculamatrise",
    storageBucket: "calculamatrise.appspot.com",
    messagingSenderId: "372669898445",
    appId: "1:372669898445:web:0445eea48a0bb5b3ca1384",
    measurementId: "G-TM55QBK8QC"
});

const ref = firebase.database().ref(room_id);
if (room_id) {
    ref.child("messages").on("child_added", function(snapshot) {
        const html = snapshot.val().author == sessionStorage.getItem("user") ? `<div class="message" data-id="${snapshot.key}" style="float: right; margin-left: 10vw"><span class="author">${snapshot.val().author}</span><span class="content" onclick="deleteMessage(this.parentElement)" onmouseenter="this.oldHTML = this.innerHTML, this.innerHTML = 'Delete', this.style.cursor = 'pointer'" onmouseleave="this.innerHTML = this.oldHTML">${snapshot.val().content}</span></div>` : `<div class="message"><span class="content">${snapshot.val().content}</span><span class="author">${snapshot.val().author}</span></div>`;
        messages.innerHTML += html;
        messages.scrollTop = messages.scrollHeight;
        function deleteMessage() {
            snapshot.getRef().remove();
            messages.innerHTML = messages.innerHTML.replace(html, "");
        }
        setTimeout(deleteMessage, 5000);
    });

    ref.child("messages").on("child_removed", function(snapshot) {
        const child = [...document.getElementsByClassName("message")].find(t => t.firstChild.innerText == snapshot.val().author && (t.lastChild.innerText == snapshot.val().content || t.lastChild.innerText.toLowerCase() == "delete"));
        child && child.remove();
    });

    user.value = sessionStorage.getItem("user") || "Anonymous";

    document.onkeydown = function() {
        if (document.activeElement == user) return;
        message.focus();
    }
} else {
    const content = document.querySelector(".content");
    content.innerHTML = null;
    content.append(Object.assign(document.createElement("input"), {
        placeholder: "Room ID",
        type: "text"
    }));
    content.append(Object.assign(document.createElement("button"), {
        innerText: "Join Room",
        onclick: function() {
            return location.href += "?room=" + this.previousSibling.value
        }
    }));
    content.append(Object.assign(document.createElement("button"), {
        innerText: "Create Room",
        onclick: function() {
            return location.href += "?room=" + Math.floor(Math.random() * 1e16).toString(36)
        }
    }));
}

function sendMessage(t) {
    if (t.length < 1) {
        error.innerHTML = "Message cannot be empty.";
        error.style.display = "block";
        setTimeout(() => {
            error.style.display = "none";
        }, 3000);
        
        return;
    }

    ref.child("messages").push().set({
        author: sessionStorage.getItem("user") || "Anonymous",
        content: t
    });
    message.value = null;
}

function deleteMessage(t) {
    const message_id = t.getAttribute("data-id");
    ref.child("messages").child(message_id).remove();
}