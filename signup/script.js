const params = new URLSearchParams(location.search);
firebase.initializeApp({
    apiKey: "AIzaSyDVnRMClAPCDp2b3N_iAISRbInKIC80Y6w",
    authDomain: "calculamatrise.firebaseapp.com",
    projectId: "calculamatrise",
    storageBucket: "calculamatrise.appspot.com",
    messagingSenderId: "372669898445",
    appId: "1:372669898445:web:0445eea48a0bb5b3ca1384",
    measurementId: "G-TM55QBK8QC"
});

const ref = firebase.database().ref("users");

function createAccount() {
    if (user.value.length < 3 && email.value.length < 3 && pass.value.length < 6) {
        error.innerText = "Username, E-Mail or Password is invalid.";
        error.style.display = "block";
        setTimeout(() => error.style.display = "none", 3000);
        return
    }
    ref.orderByChild("u_id").equalTo(user.value.toLowerCase()).once("value", t => {
        if (t.exists()) {
            error.innerText = "Username is taken.";
            error.style.display = "block";
            setTimeout(() => error.style.display = "none", 3000);
        } else {
            ref.set({
                u_id: user.value.toLowerCase(),
                u_name: user.value,
                email: email.value,
                password: pass.value
            });
        }
    })
}