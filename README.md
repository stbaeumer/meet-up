# Jitsi Invite for webxdc

## Title
Jitsi Invite for webxdc

## Goal
Create and share meeting invites in Delta Chat (or another webxdc host) from a structured form.

The app lets users:
1. Fill in meeting details (title, description, date, time, duration, room, agenda).
2. Preview the invitation in real time.
3. Send the preview as a chat draft via `webxdc.sendToChat()`.

## Images
Create invitation
<img width="864" height="1920" alt="create_invitation" src="https://github.com/user-attachments/assets/9e6ff2c9-7a74-4ea5-a715-62d6019c2bff" />
Send to chat
<img width="864" height="1920" alt="send_to_chat" src="https://github.com/user-attachments/assets/910eaf82-f07c-43eb-b0e6-d4c698da7a40" />
Message 
<img width="864" height="1920" alt="message" src="https://github.com/user-attachments/assets/f01742ec-e33c-490c-8670-ee39a57aca8d" />




Planned image slots:
1. Form view
2. Preview card
3. Chat draft output in Delta Chat

## Usage

### Run locally (browser preview)
1. Start the VS Code task `Start Jitsi Invite Preview`.
2. Open the forwarded port URL (port `5000`).

Alternative terminal command:

```bash
python3 -m http.server 5000
```

Note:
In normal browser preview, the webxdc API is not available. The app falls back to copying the message text.

### Build the `.xdc` package
Use the VS Code task `Build webxdc Package` or run:

```bash
zip -9 -r delta-jitsi-invite.xdc . -x ".git/*" ".github/*" ".vscode/*" "webxdc.js" "*.xdc"
```

Then share `delta-jitsi-invite.xdc` in your chat and start the app.

### Release automation
On every push, GitHub Actions:
1. Creates the next version tag (`0.0.1`, `0.0.2`, ...).
2. Builds a fresh `.xdc` artifact from the pushed commit.
3. Publishes a GitHub Release and attaches `delta-jitsi-invite.xdc`.

## Attributions

App icon by [Fathor Rohman](https://icon-icons.com/icon/meeting-communications-conference-video-call/250229) via icon-icons.com.
