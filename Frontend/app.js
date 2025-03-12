document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

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

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById("message").innerText = "Registrierung erfolgreich!";
        
        // Bestätigungscode-Feld anzeigen
        document.getElementById("confirmationSection").style.display = "block";

        // Neuer Tab mit Bestätigungscode öffnen
        const confirmationTab = window.open("", "_blank");
        confirmationTab.document.write(`<h1>Bestätigungscode</h1><p>${result.confirmationCode}</p>`);
        confirmationTab.document.close();
    } else {
        document.getElementById("message").innerText = "Fehler: " + result.error;
    }
});

// Bestätigungscode prüfen und bei Erfolg zur Startseite weiterleiten
document.getElementById("confirmButton").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const code = document.getElementById("confirmationCode").value;

    const response = await fetch("http://localhost:3000/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById("message").innerText = "Bestätigung erfolgreich! Du wirst in 3 Sekunden weitergeleitet...";
        
        // Nach 3 Sekunden auf die Startseite weiterleiten
        setTimeout(() => {
            window.location.href = "start.html";
        }, 3000);
    } else {
        document.getElementById("message").innerText = "Fehler: " + result.error;
    }
});