// Event-Listener für das Absenden des Login-Formulars
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars

    // E-Mail und Passwort aus den Eingabefeldern abrufen
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // API-Anfrage an den Server senden, um den Benutzer zu authentifizieren
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }) // E-Mail und Passwort als JSON-String senden
        });

        const data = await response.json(); // Serverantwort in JSON umwandeln

        if (data.success) {
            // Erfolgreicher Login: Token im Local Storage speichern
            localStorage.setItem("token", data.token);

            // Weiterleitung zur "Anmeldung erfolgreich"-Seite im gleichen Tab
            window.location.href = "anmeldung_erfolgreich.html";
        } else {
            // Falls der Login fehlschlägt, Fehlermeldung anzeigen
            document.getElementById("message").innerText = data.message;
            document.getElementById("message").style.color = "red";
        }
    } catch (error) {
        // Fehlerbehandlung, falls der Server nicht erreichbar ist
        console.error("Fehler beim Login:", error);
        document.getElementById("message").innerText = "Server nicht erreichbar!";
        document.getElementById("message").style.color = "red";
    }
});

// Funktion zum Abrufen der Benutzerdaten mit Token-Authentifizierung
async function fetchUserData() {
    const token = localStorage.getItem("token"); // Token aus dem Local Storage abrufen

    if (!token) {
        // Falls kein Token vorhanden ist, zur Login-Seite weiterleiten
        window.location.href = "login.html";
        return;
    }

    // API-Anfrage an den Server senden, um Benutzerdaten abzurufen
    const response = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` } // Token in den Header setzen
    });

    const data = await response.json(); // Serverantwort in JSON umwandeln
    console.log(data); // Benutzerdaten in der Konsole ausgeben
}