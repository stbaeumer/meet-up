# meet up (webxdc)

Web form for creating a calendar event as an `.ics` file and sending it to a chat.

## Features

### Switchable languages: Deutsch (de), English (en), Nederlands (nl), Français (fr). Default: English.



### Event fields: title, description, date, time, duration, timezone, and version.


### Location type: `offline` or `online`.


#### For `online`: Jitsi server selection, optional custom server, room name, and generated meeting link.

#### For `offline`: free text place input.

### Live preview of the generated message text inside the form.

## Releases

Current releases:
`https://github.com/stbaeumer/meet-up/releases`

## Run locally

1. Start the VS Code task `Start Wir treffen uns Preview`.
2. Open port `5000` in the browser.

Alternative:

```bash
python3 -m http.server 5000
```

Note:
In a normal browser, the `webxdc` API is not available. In that case, the app falls back to copying the message text.

## Build `.xdc`

Use the VS Code task `Build webxdc Package` or run:

```bash
zip -9 -r meet-up.xdc . -x ".git/*" ".github/*" ".vscode/*" "webxdc.js" "*.xdc"
```

Then share `meet-up.xdc` in your chat.

## Attribution

Appointment icon source:
`https://www.svgrepo.com/svg/442054/appointment-missed-symbolic`
