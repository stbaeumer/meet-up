const form = document.getElementById('inviteForm');
const locationType = document.getElementById('locationType');
const onlineFields = document.getElementById('onlineFields');
const onlineRoomField = document.getElementById('onlineRoomField');
const offlineLocationField = document.getElementById('offlineLocationField');
const offlineLocationInput = document.getElementById('offlineLocation');
const serverSelect = document.getElementById('serverSelect');
const customServerField = document.getElementById('customServerField');
const customServerInput = document.getElementById('customServer');
const roomNameInput = document.getElementById('roomName');
const meetingTitleInput = document.getElementById('meetingTitle');
const descriptionInput = document.getElementById('description');
const startDateInput = document.getElementById('startDate');
const startTimeInput = document.getElementById('startTime');
const durationInput = document.getElementById('durationMinutes');
const timezoneSelect = document.getElementById('timezoneSelect');
const sequenceInput = document.getElementById('sequenceInput');
const copyButton = document.getElementById('copyButton');
const submitHint = document.getElementById('submitHint');
const invitationOutput = document.getElementById('invitationOutput');

let feedbackTimer = 0;

function selectedServer() {
  if (serverSelect.value === 'custom') {
    return customServerInput.value.trim();
  }
  return serverSelect.value.trim();
}

function buildJoinUrl(server, room) {
  const trimmedServer = (server || '').trim();
  const trimmedRoom = (room || '').trim().replace(/^\/+/, '');

  if (!trimmedServer && !trimmedRoom) {
    return '';
  }

  if (!trimmedServer) {
    return trimmedRoom;
  }

  if (!trimmedRoom) {
    return trimmedServer.replace(/\/+$/, '');
  }

  return trimmedServer.replace(/\/+$/, '') + '/' + trimmedRoom;
}

function sanitizeSequence(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

function sanitizeDuration(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return '';
  }
  return parsed;
}

function createUid() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID() + '@meet-up.webxdc';
  }

  return String(Date.now()) + '-' + Math.random().toString(36).slice(2, 12) + '@meet-up.webxdc';
}

function getDtStampUtc() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function formatStartAsIcsLocal(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return '';
  }

  const parts = dateValue.split('-');
  const timeParts = timeValue.split(':');
  if (parts.length !== 3 || timeParts.length < 2) {
    return '';
  }

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const hours = timeParts[0].padStart(2, '0');
  const minutes = timeParts[1].padStart(2, '0');

  return year + month + day + 'T' + hours + minutes + '00';
}

function durationMinutesToIso(minutes) {
  if (!minutes) {
    return '';
  }

  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) {
    return '';
  }

  const hours = Math.floor(total / 60);
  const mins = total % 60;

  if (hours > 0 && mins > 0) {
    return 'PT' + String(hours) + 'H' + String(mins) + 'M';
  }
  if (hours > 0) {
    return 'PT' + String(hours) + 'H';
  }
  return 'PT' + String(mins) + 'M';
}

function escapeIcsText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

function escapeIcsUrl(value) {
  return String(value).replace(/\r\n|\r|\n/g, '');
}

function collectFormValues(uid) {
  const locationMode = locationType.value === 'online' ? 'online' : 'offline';
  const summary = meetingTitleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dtstart = formatStartAsIcsLocal(startDateInput.value, startTimeInput.value);
  const tzid = timezoneSelect.value;
  const durationMinutes = sanitizeDuration(durationInput.value);
  const duration = durationMinutesToIso(durationMinutes);
  const sequence = sanitizeSequence(sequenceInput.value);

  const server = locationMode === 'online' ? selectedServer() : '';
  const room = locationMode === 'online' ? roomNameInput.value.trim() : '';
  const joinUrl = locationMode === 'online' ? buildJoinUrl(server, room) : '';
  const offlineLocation = locationMode === 'offline' ? offlineLocationInput.value.trim() : '';

  let location = '';
  if (locationMode === 'online') {
    location = 'online';
  }
  if (locationMode === 'offline' && offlineLocation) {
    location = offlineLocation;
  }

  return {
    uid,
    summary,
    description,
    dtstart,
    tzid,
    duration,
    sequence,
    locationMode,
    location,
    joinUrl
  };
}

function buildSharedMessage(values) {
  const lines = ['Kalendereintrag (.ics):'];

  if (values.summary) {
    lines.push('SUMMARY: ' + values.summary);
  }
  if (values.description) {
    lines.push('DESCRIPTION: ' + values.description);
  }
  if (values.dtstart) {
    lines.push('DTSTART;TZID=' + values.tzid + ': ' + values.dtstart);
  }
  if (values.duration) {
    lines.push('DURATION: ' + values.duration);
  }
  if (values.location) {
    lines.push('LOCATION: ' + values.location);
  }
  if (values.joinUrl) {
    lines.push('URL: ' + values.joinUrl);
  }

  lines.push('UID: ' + values.uid);
  lines.push('SEQUENCE: ' + String(values.sequence));

  return lines.join('\n');
}

function buildIcsContent(values) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DeltaChat//Meet Up//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + escapeIcsText(values.uid),
    'DTSTAMP:' + getDtStampUtc(),
    'SEQUENCE:' + String(values.sequence)
  ];

  if (values.summary) {
    lines.push('SUMMARY:' + escapeIcsText(values.summary));
  }
  if (values.description) {
    lines.push('DESCRIPTION:' + escapeIcsText(values.description));
  }
  if (values.dtstart) {
    lines.push('DTSTART;TZID=' + escapeIcsText(values.tzid) + ':' + values.dtstart);
  }
  if (values.duration) {
    lines.push('DURATION:' + values.duration);
  }
  if (values.location) {
    lines.push('LOCATION:' + escapeIcsText(values.location));
  }
  if (values.joinUrl) {
    lines.push('URL:' + escapeIcsUrl(values.joinUrl));
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

function fileNameFromSummary(summary) {
  const cleaned = summary
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  if (!cleaned) {
    return 'termin.ics';
  }

  return cleaned + '.ics';
}

function showSubmitFeedback(message, state) {
  submitHint.dataset.feedback = 'true';
  submitHint.textContent = message;
  submitHint.classList.toggle('is-success', state === 'success');
  submitHint.classList.toggle('is-error', state === 'error');

  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    submitHint.dataset.feedback = '';
    submitHint.textContent = 'Der erste Button erzeugt einen Chat-Entwurf mit .ics-Datei, der zweite kopiert den Nachrichtentext.';
    submitHint.classList.remove('is-success', 'is-error');
  }, 2800);
}

function updateDynamicVisibility() {
  const isOnline = locationType.value === 'online';
  onlineFields.classList.toggle('hidden', !isOnline);
  onlineRoomField.classList.toggle('hidden', !isOnline);
  customServerField.classList.toggle('hidden', !isOnline || serverSelect.value !== 'custom');
  offlineLocationField.classList.toggle('hidden', isOnline);

  if (isOnline) {
    offlineLocationInput.value = '';
  } else {
    roomNameInput.value = '';
    customServerInput.value = '';
  }
}

function updatePreview() {
  const values = collectFormValues('wird-beim-senden-erzeugt@meet-up.webxdc');
  invitationOutput.textContent = buildSharedMessage(values);
}

async function copyInvitation() {
  const values = collectFormValues(createUid());
  const text = buildSharedMessage(values);

  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Nachricht kopiert';
    copyButton.classList.add('is-success');
    window.setTimeout(() => {
      copyButton.textContent = 'Nachricht kopieren';
      copyButton.classList.remove('is-success');
    }, 1800);
  } catch {
    invitationOutput.textContent = text;
  }
}

async function sendMessageToChat() {
  const values = collectFormValues(createUid());
  const text = buildSharedMessage(values);
  const icsContent = buildIcsContent(values);
  const icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const fileName = fileNameFromSummary(values.summary || 'termin');

  try {
    if (!window.webxdc || window.webxdc.__isFallback || typeof window.webxdc.sendToChat !== 'function') {
      await navigator.clipboard.writeText(text);
      invitationOutput.textContent = text;
      showSubmitFeedback('webxdc ist hier nicht verfuegbar. Nachrichtentext wurde kopiert.', 'success');
      return;
    }

    await window.webxdc.sendToChat({
      text,
      file: {
        name: fileName,
        blob: icsBlob
      }
    });

    invitationOutput.textContent = text;
    showSubmitFeedback('Der Chat-Entwurf wurde mit .ics-Datei vorbereitet.', 'success');
  } catch (error) {
    console.error(error);
    invitationOutput.textContent = text;
    showSubmitFeedback('Die Nachricht konnte nicht an den Chat uebergeben werden.', 'error');
  }
}

locationType.addEventListener('change', () => {
  updateDynamicVisibility();
  updatePreview();
});

serverSelect.addEventListener('change', () => {
  updateDynamicVisibility();
  updatePreview();
});

copyButton.addEventListener('click', copyInvitation);

[
  meetingTitleInput,
  descriptionInput,
  startDateInput,
  startTimeInput,
  durationInput,
  timezoneSelect,
  sequenceInput,
  customServerInput,
  roomNameInput,
  offlineLocationInput
].forEach((field) => {
  field.addEventListener('input', updatePreview);
  field.addEventListener('change', updatePreview);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessageToChat();
});

updateDynamicVisibility();
updatePreview();
