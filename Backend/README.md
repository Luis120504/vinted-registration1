# Web-Programmierung

## Entwickler: Luis Leberer

### Vinted Komponente: Benutzerregistrierung

## Funktionen der Komponente
- Benutzerregistrierung und -anmeldung mit JWT-Authentifizierung
- Verifizierung durch einen Bestätigungscode nach der Registrierung
- Passwort-Zurücksetzen mit Verifizierung durch Bestätigungscode und neuem Passwort
- Schutz von API-Endpunkten durch JWT-Token, um unbefugten Zugriff zu verhindern
- Sichere Speicherung von Benutzerpasswörtern

## Verwendete Technologien
### Backend:
- Node.js mit Express.js
- JWT (JSON Web Token)
- bcrypt
- SQLite
- CORS

### Frontend:
- HTML, CSS, JavaScript
- Fetch API
- Local Storage

## Erforderliche Downloads zum Testen der Komponente
- [Node.js](https://nodejs.org/)
- [DB Browser for SQLite](https://sqlitebrowser.org/) (falls die Datenbank eingesehen werden soll)
- [GitHub](https://git-scm.com/) (falls das Projekt geklont werden soll)

## Testen der Komponente
### Repository klonen:
```sh
 git clone <URL des Repositorys>
 cd Backend
```
### oder ordner manuell hinzufügen
### Abhängigkeiten installieren:
```sh
 npm install express body-parser cors sqlite3 bcrypt jsonwebtoken
```
### Server starten:
```sh
 node server.js
```
### Frontend starten:
Öffne die `start.html` im Browser und teste die Anwendung.

## Softwaredesign
### Architektur
- Die Komponente ist modular aufgebaut.
- Frontend und Backend sind getrennt.
- Das Backend verwendet Node.js mit Express.js.
- Benutzerkonten und ihre Adressen werden in einer SQLite-Datenbank gespeichert (in zwei Tabellen, verbunden über die User-ID).
- Passwörter werden mit bcrypt gehasht.
- JWT wird zur Authentifizierung genutzt und im Local Storage gespeichert.
- Die API ist mit CORS geschützt, um nur autorisierten Clients Zugriff zu gewähren.

## Designentscheidungen
- **Trennung von Frontend und Backend**: Erhöht Flexibilität und erleichtert zukünftige Erweiterungen.
- **SQLite-Datenbank**: Einfache und ausreichende Lösung für die Speicherung von Benutzerdaten.
- **JWT-Authentifizierung**: Ermöglicht eine sichere Anmeldung über mehrere Komponenten hinweg.
- **bcrypt zur Passwortsicherheit**: Schützt Passwörter durch Hashing.
- **Local Storage für persistente Sitzungen**: Nutzer bleiben auch nach einem Seiten-Reload eingeloggt.
- **CORS-Schutz**: Erlaubt den Zugriff nur für autorisierte Quellen.

## Integration mit anderen Komponenten und der Gesamtsoftware
- **Integration in die Startseite von Erik**: Nach einer erfolgreichen Anmeldung gibt es einen „Startseite“-Button. Dieser könnte direkt auf die korrekte Startseite weiterleiten.
- **Integration mit dem Chatsystem, der Bestellfunktion und der Anzeigeerstellung**: Diese Komponenten basieren auf registrierten Nutzern, die von dieser Komponente bereitgestellt werden.

## Zukünftige Erweiterungen
- **E-Mail-Verifizierung**: Statt eines angezeigten Bestätigungscodes könnte eine E-Mail mit einem Verifizierungscode versendet werden –