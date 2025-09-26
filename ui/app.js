(function() {
  const form = document.getElementById('preview-form');
  const recipientEl = document.getElementById('recipient');
  const subjectEl = document.getElementById('subject');
  const bodyEl = document.getElementById('body');
  const output = document.getElementById('output');
  const previewText = document.getElementById('previewText');
  const copyBtn = document.getElementById('copyPreview');
  const fillDemoBtn = document.getElementById('fillDemo');

  function generateUuid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    // Fallback simple UUID v4-ish
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function sha256Hex(text) {
    if (window.crypto && window.crypto.subtle) {
      const data = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback not cryptographically secure
    let x = 0;
    for (let i = 0; i < text.length; i += 1) x = ((x << 5) - x) + text.charCodeAt(i) | 0;
    return (x >>> 0).toString(16).padStart(8, '0').repeat(8).slice(0, 64);
  }

  function buildTrackingUrl(baseUrl, rid, cid) {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set('rid', rid);
      url.searchParams.set('cid', cid);
      return url.toString();
    } catch (e) {
      return baseUrl + '?rid=' + encodeURIComponent(rid) + '&cid=' + encodeURIComponent(cid);
    }
  }

  function sanitize(text) {
    return String(text || '').replace(/\r\n|\r/g, '\n');
  }

  function validateEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function buildPreviewBlock(to, subject, body, tracking) {
    const parts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body,
      '',
      `Tracking: ${tracking}`,
      '',
      '[Notice] This is a preview for education and authorized training only. No email was sent.'
    ];
    return parts.join('\n');
  }

  function saveDraft(to, subject, body) {
    try {
      localStorage.setItem('psim.recipient', to);
      localStorage.setItem('psim.subject', subject);
      localStorage.setItem('psim.body', body);
    } catch (e) {}
  }

  function loadDraft() {
    try {
      const to = localStorage.getItem('psim.recipient') || '';
      const subject = localStorage.getItem('psim.subject') || '';
      const body = localStorage.getItem('psim.body') || '';
      if (to) recipientEl.value = to;
      if (subject) subjectEl.value = subject;
      if (body) bodyEl.value = body;
    } catch (e) {}
  }

  fillDemoBtn.addEventListener('click', () => {
    if (!recipientEl.value) recipientEl.value = 'recipient@example.com';
    if (!subjectEl.value) subjectEl.value = 'Just checking in';
    if (!bodyEl.value) bodyEl.value = 'I couldn\'t sleep and it looked like you flew—then you\'re back.\n\nCould you confirm the update we discussed earlier today?';
  });

  copyBtn.addEventListener('click', async () => {
    const text = previewText.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = 'Copied';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
      } catch (_) {}
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const to = sanitize(recipientEl.value.trim());
    const subject = sanitize(subjectEl.value.trim() || 'Action required: Verify your account');
    const body = sanitize(bodyEl.value.trim());

    if (!validateEmail(to)) {
      recipientEl.focus();
      recipientEl.setAttribute('aria-invalid', 'true');
      return;
    }

    const cid = generateUuid();
    const rid = (await sha256Hex(to)).slice(0, 12);
    const tracking = buildTrackingUrl('https://training.example.org/learn', rid, cid);

    const preview = buildPreviewBlock(to, subject, body || 'This is a sample training email body.', tracking);
    previewText.textContent = preview;
    output.hidden = false;
    saveDraft(to, subject, body);
  });

  loadDraft();
})();


