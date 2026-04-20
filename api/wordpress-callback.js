export default async function handler(req, res) {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).send(`OAuth error: ${error}`);
  }

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  if (!state || state !== process.env.WP_OAUTH_STATE) {
    return res.status(400).send('Invalid state');
  }

  const params = new URLSearchParams({
    client_id: process.env.WP_CLIENT_ID,
    client_secret: process.env.WP_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.WP_REDIRECT_URI
  });

  try {
    const tokenRes = await fetch('https://public-api.wordpress.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(400).json(tokenData);
    }

    return res.status(200).json({
      success: true,
      message: 'OAuth completed successfully',
      tokenData
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
