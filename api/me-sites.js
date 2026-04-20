export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.WP_ACCESS_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Missing WP_ACCESS_TOKEN env var' });
  }

  try {
    const response = await fetch('https://public-api.wordpress.com/rest/v1.1/me/sites', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch sites',
      details: error.message
    });
  }
}
