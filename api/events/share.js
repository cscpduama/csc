const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { id } = req.query;
  
  try {
    const dataPath = path.join(process.cwd(), 'data', 'events.json');
    const events = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const e = events.find(x => String(x.id) === String(id));

    if (!e) {
      return res.redirect('/events');
    }

    const baseUrl = `https://${req.headers.host}`;
    
    // Logic for determining the share image
    let image = e.image;
    
    // Ensure image is absolute
    if (image && !image.startsWith('http')) {
      const cleanPath = image.startsWith('/') ? image.substring(1) : image;
      image = `${baseUrl}/${cleanPath}`;
    }
    
    // Default image if none found
    if (!image) {
      image = `${baseUrl}/assets/favicon/cs_department_logo.jpg`;
    }

    const imageType = image.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${e.title}</title>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${e.title}">
  <meta property="og:description" content="${e.description || 'Check out this event at the Department of Computer Science, PDUAM Amjonga.'}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="${imageType}">
  <meta property="og:url" content="${baseUrl}/events#event-${e.id}">
  <meta property="og:site_name" content="CS Department, PDUAM Amjonga">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e.title}">
  <meta name="twitter:description" content="${e.description || 'Check out this event at the Department of Computer Science, PDUAM Amjonga.'}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:url" content="${baseUrl}/events#event-${e.id}">

  <!-- Meta Refresh Redirect for Users -->
  <meta http-equiv="refresh" content="0;url=/events#event-${e.id}">
</head>
<body>
  <p>Redirecting to event: <strong>${e.title}</strong>...</p>
  <script>
    window.location.href = "/events#event-${e.id}";
  </script>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).send(html);
    
  } catch (error) {
    console.error(error);
    return res.redirect('/events');
  }
};
