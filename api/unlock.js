const crypto = require('crypto');

const esc = (s) => (s || '').replace(/([\\;,:"])/g, '\\$1');

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Prevent caching of credential / authentication responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const guess = String(body.key || '').trim().toLowerCase();

    const hex = crypto.createHash('sha256').update(guess, 'utf8').digest('hex');

    const expectedHash = process.env.PASS_HASH;
    const wifiSsid = process.env.WIFI_SSID;
    const wifiPass = process.env.WIFI_PASS;

    if (!expectedHash || hex !== expectedHash) {
      return res.status(401).json({ ok: false });
    }

    const wifi = `WIFI:T:WPA;S:${esc(wifiSsid)};P:${esc(wifiPass)};H:true;;`;

    return res.status(200).json({
      ok: true,
      ssid: wifiSsid,
      password: wifiPass,
      wifi: wifi
    });
  } catch (err) {
    return res.status(400).json({ error: 'Bad request' });
  }
};
