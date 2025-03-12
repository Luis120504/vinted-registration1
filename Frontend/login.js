document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("token", data.token); // Token speichern
            window.open("anmeldung_erfolgreich.html", "_blank");
        } else {
            document.getElementById("message").innerText = data.message;
            document.getElementById("message").style.color = "red";
        }
    } catch (error) {
        console.error("Fehler beim Login:", error);
        document.getElementById("message").innerText = "Server nicht erreichbar!";
        document.getElementById("message").style.color = "red";
    }
});

// Token bei API-Anfragen mitgeben
async function fetchUserData() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const response = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    console.log(data);
}
