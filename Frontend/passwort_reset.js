// Event-Listener für das Absenden des Formulars zur Anforderung des Bestätigungscodes
document.getElementById("requestResetForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars
    
    // E-Mail-Adresse aus dem Eingabefeld abrufen
    const email = document.getElementById("resetEmail").value;

    try {
        // API-Anfrage an den Server senden, um einen Bestätigungscode anzufordern
        const response = await fetch("http://localhost:3000/request-password-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }) // E-Mail als JSON-String senden
        });

        const data = await response.json(); // Serverantwort in JSON umwandeln

        if (response.ok) {
            // Erfolgreiche Anforderung: Bestätigungscode anzeigen und Eingabefeld für den Code sichtbar machen
            document.getElementById("resetMessage").innerText = 
                "Bestätigungscode wurde gesendet! Dein Code: " + data.confirmationCode;
            document.getElementById("resetMessage").style.color = "green";
            document.getElementById("resetSection").style.display = "block";
        } else {
            // Falls die Anforderung fehlschlägt, Fehlermeldung anzeigen
            document.getElementById("resetMessage").innerText = "Fehler: " + data.error;
            document.getElementById("resetMessage").style.color = "red";
        }
    } catch (error) {
        console.error("Fehler beim Anfordern des Bestätigungscodes:", error);
        document.getElementById("resetMessage").innerText = "Server nicht erreichbar!";
        document.getElementById("resetMessage").style.color = "red";
    }
});

// Event-Listener für das Zurücksetzen des Passworts
document.getElementById("resetButton").addEventListener("click", async function () {
    // Benutzereingaben abrufen
    const email = document.getElementById("resetEmail").value;
    const code = document.getElementById("resetCode").value;
    const newPassword = document.getElementById("newPassword").value;

    try {
        // API-Anfrage an den Server senden, um das Passwort zu ändern
        const response = await fetch("http://localhost:3000/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, newPassword }) // Daten als JSON senden
        });

        const data = await response.json(); // Serverantwort in JSON umwandeln

        if (response.ok) {
            // Erfolgreiche Passwortänderung bestätigen
            document.getElementById("resetMessage").innerText = "Passwort erfolgreich geändert!";
            document.getElementById("resetMessage").style.color = "green";
        } else {
            // Falls die Passwortänderung fehlschlägt, Fehlermeldung anzeigen
            document.getElementById("resetMessage").innerText = "Fehler: " + data.error;
            document.getElementById("resetMessage").style.color = "red";
        }
    } catch (error) {
        console.error("Fehler beim Zurücksetzen des Passworts:", error);
        document.getElementById("resetMessage").innerText = "Server nicht erreichbar!";
        document.getElementById("resetMessage").style.color = "red";
    }
});