#!/usr/bin/env node
/**
 * Phishing Simulator (Preview-Only)
 *
 * This CLI generates safe, preview-only phishing simulation content.
 * It DOES NOT send emails. Use strictly for educational and training purposes
 * on systems and recipients you are authorized to test.
 */

const crypto = require('crypto');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const part = argv[i];
    const next = argv[i + 1];
    if (part.startsWith('--')) {
      const [key, inlineVal] = part.split('=');
      const name = key.replace(/^--/, '');
      if (inlineVal !== undefined) {
        args[name] = inlineVal;
      } else if (next && !next.startsWith('--')) {
        args[name] = next;
        i += 1;
      } else {
        args[name] = true;
      }
    }
  }
  return args;
}

function generateCampaignId() {
  return crypto.randomUUID();
}

function coerceArray(maybeCsv) {
  if (!maybeCsv) return [];
  if (Array.isArray(maybeCsv)) return maybeCsv;
  return String(maybeCsv)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildTrackingUrl(baseUrl, recipientId, campaignId) {
  const url = new URL(baseUrl);
  url.searchParams.set('rid', recipientId);
  url.searchParams.set('cid', campaignId);
  return url.toString();
}

function selectTemplate(name) {
  const lower = (name || 'basic').toLowerCase();
  const collection = {
    basic: {
      subject: 'Action required: Verify your account',
      body: ({ link }) => `We noticed unusual activity on your account.\n\n` +
        `Please verify your identity by visiting the secure link below:\n${link}\n\n` +
        `If you did not request this, no further action is required.`
    },
    payroll: {
      subject: 'Payroll update: Direct deposit confirmation',
      body: ({ link }) => `Your direct deposit information requires confirmation.\n\n` +
        `Open the secure page to review and confirm your details:\n${link}\n\n` +
        `This link will expire in 24 hours.`
    },
    package: {
      subject: 'Delivery notice: Action needed to reschedule',
      body: ({ link }) => `Your package delivery was attempted but could not be completed.\n\n` +
        `Choose a new delivery time at the following link:\n${link}\n\n` +
        `Thank you for choosing our courier service.`
    }
  };
  return collection[lower] || collection.basic;
}

function buildPreview(args) {
  const authorized = Boolean(args.authorized);
  const dryRun = args.send ? false : true;
  if (!dryRun) {
    // Even if someone passes --send, we refuse for safety.
    throw new Error('Sending emails is disabled in this preview-only simulator.');
  }

  const campaignId = args.campaign || generateCampaignId();
  const recipients = coerceArray(args.to).length
    ? coerceArray(args.to)
    : ['alex@example.com', 'sam@example.com', 'taylor@example.com'];

  const baseUrl = args.trackingBase || 'https://training.example.org/learn';
  const template = selectTemplate(args.scenario || args.template || 'basic');

  const subject = args.subject || template.subject;

  const previews = recipients.map((email, index) => {
    const recipientId = crypto
      .createHash('sha256')
      .update(String(index) + '|' + email)
      .digest('hex')
      .slice(0, 12);
    const link = buildTrackingUrl(baseUrl, recipientId, campaignId);
    const body = (args.body || template.body)({ link, email, recipientId, campaignId });
    return { email, recipientId, subject, body, link };
  });

  return {
    authorized,
    dryRun,
    campaignId,
    recipients: previews.map((p) => p.email),
    previews
  };
}

function printPreview(result) {
  const banner = '='.repeat(72);
  console.log(banner);
  console.log('Phishing Simulator (Preview-Only)');
  console.log(banner);
  console.log(`Authorized testing: ${result.authorized ? 'YES' : 'NO (set --authorized=true for approved tests)'}`);
  console.log(`Campaign ID      : ${result.campaignId}`);
  console.log(`Recipients       : ${result.recipients.length}`);
  console.log('');

  result.previews.forEach((p, idx) => {
    const header = `#${String(idx + 1).padStart(2, '0')} ${p.email}`;
    console.log(header);
    console.log('-'.repeat(header.length));
    console.log(`Subject: ${p.subject}`);
    console.log(`Tracking: ${p.link}`);
    console.log('');
    console.log(p.body);
    console.log('');
  });

  console.log(banner);
  console.log('Safety: This tool does not send emails. Content is printed for review.');
  console.log('Only conduct simulations with explicit authorization.');
  console.log(banner);
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const result = buildPreview(args);
    printPreview(result);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();


