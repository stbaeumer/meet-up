# Wir treffen uns (webxdc)

Webformular zum Erstellen eines Kalendereintrags als `.ics`-Datei und Versand in einen Chat.

## Funktionen

1. Sprache umschaltbar: Deutsch (de), English (en), Nederlands (nl), Français (fr). Standard: English.
2. Terminfelder: Titel, Beschreibung, Datum, Uhrzeit, Dauer, Zeitzone, Sequence.
3. Location-Typ: `offline` oder `online`.
4. Bei `online`: Jitsi-Serverauswahl, optional eigener Server, Raumname und Link-Erzeugung.
5. Bei `offline`: freie Ortsangabe.
6. Versand an den Chat mit angehängter `.ics`-Datei via `webxdc.sendToChat()`.
7. Live-Vorschau des Nachrichtentextes im Formular.

## Releases

Aktuelle Releases:
`https://github.com/stbaeumer/meet-up/releases`

## Lokal starten

1. VS Code Task `Start Wir treffen uns Preview` starten.
2. Port `5000` im Browser öffnen.

Alternative:

```bash
python3 -m http.server 5000
```

Hinweis:
Im normalen Browser ist die `webxdc`-API nicht verfügbar. Dann kopiert die App stattdessen den Nachrichtentext.

## Build `.xdc`

Per VS Code Task `Build webxdc Package` oder per Terminal:

```bash
zip -9 -r meet-up.xdc . -x ".git/*" ".github/*" ".vscode/*" "webxdc.js" "*.xdc"
```

Anschließend `meet-up.xdc` im Chat teilen.

## Attribution

Appointment icon source:
`https://www.svgrepo.com/svg/442054/appointment-missed-symbolic`
