export default async function handler(req, res) {
  const token = process.env.WP_ACCESS_TOKEN;
  const siteId = process.env.WP_SITE_ID;

  if (!token) {
    return res.status(500).json({ error: 'Missing WP_ACCESS_TOKEN env var' });
  }

  if (!siteId) {
    return res.status(500).json({ error: 'Missing WP_SITE_ID env var' });
  }

  const endpoint = `https://public-api.wordpress.com/wp/v2/sites/${siteId}/pages`;

  try {
    if (req.method === 'GET') {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process pages request',
      details: error.message
    });
  }
}
