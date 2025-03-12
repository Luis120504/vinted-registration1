const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const db = new sqlite3.Database("database.db");

app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = "meinGeheimerSchlüssel"; // In einer .env Datei speichern!

let pendingUsers = {}; // Temporärer Speicher für unbestätigte Benutzer
let resetCodes = {}; // Temporärer Speicher für Passwort-Reset-Codes

// **Datenbank initialisieren**
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL, 
        username TEXT NOT NULL, 
        password TEXT NOT NULL, 
        confirmed INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        street TEXT NOT NULL,
        house_number TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        city TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
});

// **Hilfsfunktion zur Code-Generierung**
function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-stelliger Code
}

// **Registrierung mit Bestätigungscode**
app.post("/register", async (req, res) => {
    const { firstname, lastname, email, username, password, street, house_number, postal_code, city } = req.body;

    if (!firstname || !lastname || !email || !username || !password || !street || !house_number || !postal_code || !city) {
        return res.status(400).json({ error: "Bitte alle Felder ausfüllen!" });
    }

    db.get("SELECT email FROM users WHERE email = ?", [email], async (err, row) => {
        if (row) {
            return res.status(400).json({ error: "Diese E-Mail wird bereits verwendet!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmationCode = generateConfirmationCode();

        pendingUsers[email] = {
            firstname,
            lastname,
            email,
            username,
            hashedPassword,
            street,
            house_number,
            postal_code,
            city,
            confirmationCode
        };

        res.json({ message: "Bestätigungscode gesendet!", confirmationCode });
    });
});

// **Bestätigungscode überprüfen**
app.post("/confirm", (req, res) => {
    const { email, code } = req.body;

    const pendingUser = pendingUsers[email];

    if (!pendingUser) {
        return res.status(400).json({ error: "Kein ausstehender Benutzer gefunden!" });
    }

    if (pendingUser.confirmationCode !== code) {
        return res.status(400).json({ error: "Falscher Bestätigungscode!" });
    }

    db.run(
        "INSERT INTO users (firstname, lastname, email, username, password, confirmed) VALUES (?, ?, ?, ?, ?, 1)",
        [pendingUser.firstname, pendingUser.lastname, pendingUser.email, pendingUser.username, pendingUser.hashedPassword],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const userId = this.lastID;

            db.run(
                "INSERT INTO addresses (user_id, street, house_number, postal_code, city) VALUES (?, ?, ?, ?, ?)",
                [userId, pendingUser.street, pendingUser.house_number, pendingUser.postal_code, pendingUser.city],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    delete pendingUsers[email];

                    res.json({ message: "Bestätigung erfolgreich! Dein Konto wurde erstellt." });
                }
            );
        }
    );
});

// **Login mit JWT-Token**
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (!user) {
            return res.status(400).json({ success: false, message: "Benutzer nicht gefunden." });
        }

        if (user.confirmed === 0) {
            return res.status(400).json({ success: false, message: "Bitte bestätige zuerst deine Registrierung!" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Falsches Passwort!" });
        }

        // Token erstellen
        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ success: true, message: "Login erfolgreich!", token });
    });
});

// **Middleware für geschützte Routen**
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(403).json({ error: "Kein Token vorhanden!" });

    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Ungültiges Token!" });
    }
};

// **Geschützte Route - Benutzerdaten abrufen**
app.get("/me", verifyToken, (req, res) => {
    res.json({ message: "Willkommen!", user: req.user });
});

// **Passwort-Reset-Code senden**
app.post("/request-password-reset", (req, res) => {
    const { email } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (!user) {
            return res.status(400).json({ error: "E-Mail nicht gefunden!" });
        }

        const resetCode = generateConfirmationCode();
        resetCodes[email] = resetCode;

        console.log(`Passwort-Reset-Code für ${email}: ${resetCode}`);

        res.json({ message: "Bestätigungscode wurde gesendet!", confirmationCode: resetCode });
    });
});

// **Passwort zurücksetzen**
app.post("/reset-password", async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ error: "Bitte alle Felder ausfüllen!" });
    }

    if (!resetCodes[email] || resetCodes[email] !== code) {
        return res.status(400).json({ error: "Falscher oder abgelaufener Code!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
        if (err) {
            return res.status(500).json({ error: "Fehler beim Speichern des neuen Passworts!" });
        }

        delete resetCodes[email];
        res.json({ message: "Passwort erfolgreich geändert!" });
    });
});

// **Server starten**
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});