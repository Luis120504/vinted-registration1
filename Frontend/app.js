// Event-Listener für das Absenden des Registrierungsformulars
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars

    // Benutzerdaten aus den Eingabefeldern sammeln
    const formData = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        street: document.getElementById("street").value,
        house_number: document.getElementById("house_number").value,
        postal_code: document.getElementById("postal_code").value,
        city: document.getElementById("city").value
    };

    // API-Anfrage an den Server senden, um die Registrierung durchzuführen
    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Daten als JSON-String senden
    });

    const result = await response.json(); // Serverantwort in JSON umwandeln

    if (response.ok) {
        document.getElementById("message").innerText = "Registrierung erfolgreich!";
        
        // Bestätigungscode-Eingabefeld sichtbar machen
        document.getElementById("confirmationSection").style.display = "block";

        // Bestätigungscode in einem neuen Fenster anzeigen
        const confirmationTab = window.open("", "_blank");
        confirmationTab.document.write(`<h1>Bestätigungscode</h1><p>${result.confirmationCode}</p>`);
        confirmationTab.document.close();
    } else {
        // Fehlermeldung anzeigen, falls die Registrierung fehlschlägt
        document.getElementById("message").innerText = "Fehler: " + result.error;
    }
});

// Event-Listener für den Bestätigungscode-Button
document.getElementById("confirmButton").addEventListener("click", async () => {
    const email = document.getElementById("email").value; // E-Mail-Adresse aus dem Eingabefeld abrufen
    const code = document.getElementById("confirmationCode").value; // Bestätigungscode abrufen

    // API-Anfrage an den Server senden, um den Bestätigungscode zu überprüfen
    const response = await fetch("http://localhost:3000/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });

    const result = await response.json(); // Serverantwort in JSON umwandeln

    if (response.ok) {
        // Erfolgsnachricht anzeigen
        document.getElementById("message").innerText = "Bestätigung erfolgreich! Du wirst in 3 Sekunden weitergeleitet...";
        
        // Nach 3 Sekunden auf die Startseite weiterleiten
        setTimeout(() => {
            window.location.href = "start.html";
        }, 3000);
    } else {
        // Fehlermeldung anzeigen, falls der Code falsch ist
        document.getElementById("message").innerText = "Fehler: " + result.error;
    }
});