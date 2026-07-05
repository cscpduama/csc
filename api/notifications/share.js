const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { id } = req.query;
  
  try {
    const dataPath = path.join(process.cwd(), 'data', 'notifications.json');
    const notifications = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const n = notifications.find(x => String(x.id) === String(id));

    if (!n) {
      return res.redirect('/notifications');
    }

    const baseUrl = `https://${req.headers.host}`;
    
    // Logic for determining the share image
    let image = n.url;
    
    // Check if n.url is an image (simple check)
    const isImg = s => s && (s.endsWith('.jpg') || s.endsWith('.png') || s.endsWith('.jpeg') || s.endsWith('.webp') || s.includes('drive.google.com'));
    
    if (!isImg(image)) {
      // If the main URL isn't an image, try specific image fields or metaLink
      image = n.image || (n.metaLink && isImg(n.metaLink.url) ? n.metaLink.url : null);
    }
    
    // Ensure image is absolute
    if (image && !image.startsWith('http')) {
      // Remove leading slash if exists to avoid double slash
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
  <title>${n.title}</title>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${n.title}">
  <meta property="og:description" content="${n.text}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="${imageType}">
  <meta property="og:url" content="${baseUrl}/notifications#notif-${n.id}">
  <meta property="og:site_name" content="CS Department, PDUAM Amjonga">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${n.title}">
  <meta name="twitter:description" content="${n.text}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:url" content="${baseUrl}/notifications#notif-${n.id}">

  <!-- Meta Refresh Redirect for Users -->
  <meta http-equiv="refresh" content="0;url=/notifications#notif-${n.id}">
</head>
<body>
  <p>Redirecting to notification: <strong>${n.title}</strong>...</p>
  <script>
    window.location.href = "/notifications#notif-${n.id}";
  </script>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).send(html);
    
  } catch (error) {
    console.error(error);
    return res.redirect('/notifications');
  }
};
