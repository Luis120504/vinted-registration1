document.getElementById("requestResetForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("resetEmail").value;

    const response = await fetch("http://localhost:3000/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("resetMessage").innerText = 
            "Bestätigungscode wurde gesendet! Dein Code: " + data.confirmationCode;
        document.getElementById("resetMessage").style.color = "green";
        document.getElementById("resetSection").style.display = "block";
    } else {
        document.getElementById("resetMessage").innerText = "Fehler: " + data.error;
        document.getElementById("resetMessage").style.color = "red";
    }
});

// Passwort zurücksetzen
document.getElementById("resetButton").addEventListener("click", async function () {
    const email = document.getElementById("resetEmail").value;
    const code = document.getElementById("resetCode").value;
    const newPassword = document.getElementById("newPassword").value;

    const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword })
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("resetMessage").innerText = "Passwort erfolgreich geändert!";
        document.getElementById("resetMessage").style.color = "green";
    } else {
        document.getElementById("resetMessage").innerText = "Fehler: " + data.error;
        document.getElementById("resetMessage").style.color = "red";
    }
});
