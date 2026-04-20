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
    title,
    content = '',
    slug = '',
    status = 'draft',
    parent = '',
    menu_order = 0,
    page_template = '',
    excerpt = ''
  } = req.body || {};

  if (!title) {
    return res.status(400).json({ error: 'Missing required field: title' });
  }

  const endpoint = `https://public-api.wordpress.com/rest/v1.1/sites/${siteId}/posts/new/`;

  const body = new URLSearchParams();
  body.append('title', title);
  body.append('content', content);
  body.append('type', 'page');
  body.append('status', status);

  if (slug) body.append('slug', slug);
  if (excerpt) body.append('excerpt', excerpt);
  if (parent) body.append('parent', parent);
  if (menu_order !== undefined) body.append('menu_order', String(menu_order));
  if (page_template) body.append('page_template', page_template);

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
      error: 'Failed to create page',
      details: error.message
    });
  }
}
