export default async function handler(req, res) {
  const token = process.env.WP_ACCESS_TOKEN;
  const siteId = process.env.WP_SITE_ID;

  if (!token) {
    return res.status(500).json({ error: 'Missing WP_ACCESS_TOKEN env var' });
  }

  if (!siteId) {
    return res.status(500).json({ error: 'Missing WP_SITE_ID env var' });
  }

  const endpoint = `https://public-api.wordpress.com/rest/v1.1/sites/${siteId}/posts/?type=page&number=100`;

  try {
    if (req.method === 'GET') {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : { raw: '' };
      } catch {
        data = { raw: text };
      }

      return res.status(response.status).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch pages',
      details: error.message
    });
  }
}
