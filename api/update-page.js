export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.WP_ACCESS_TOKEN;
  const siteId = process.env.WP_SITE_ID;

  if (!token) {
    return res.status(500).json({ error: 'Missing WP_ACCESS_TOKEN env var' });
  }

  if (!siteId) {
    return res.status(500).json({ error: 'Missing WP_SITE_ID env var' });
  }

  const {
    postId,
    title,
    content,
    slug,
    status,
    parent,
    menu_order,
    page_template,
    excerpt
  } = req.body || {};

  if (!postId) {
    return res.status(400).json({ error: 'Missing required field: postId' });
  }

  const endpoint = `https://public-api.wordpress.com/rest/v1.1/sites/${siteId}/posts/${postId}`;

  const body = new URLSearchParams();

  if (title !== undefined) body.append('title', title);
  if (content !== undefined) body.append('content', content);
  if (slug !== undefined) body.append('slug', slug);
  if (status !== undefined) body.append('status', status);
  if (excerpt !== undefined) body.append('excerpt', excerpt);
  if (parent !== undefined) body.append('parent', String(parent));
  if (menu_order !== undefined) body.append('menu_order', String(menu_order));
  if (page_template !== undefined) body.append('page_template', page_template);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : { raw: '' };
    } catch {
      data = { raw: text };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to update page',
      details: error.message
    });
  }
}
