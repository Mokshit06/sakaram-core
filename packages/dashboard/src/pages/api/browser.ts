import { NextApiRequest, NextApiResponse } from 'next';
import { URL } from 'url';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url as string;
  if (!url) return res.status(400).send('`url` missing');

  res.send(await loadURL(url));
}

async function loadURL(url: string): Promise<string> {
  const response = await fetch(url);
  let html = await response.text();

  // console.log(Object.fromEntries(response.headers.entries()));
  if (response.headers.has('location')) {
    return await loadURL(response.headers.get('location')!);
  }

  const parsedUrl = new URL(url);
  const domain = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

  html = html.replace(/src="/g, `src="${domain}`);
  html = html.replace(/href="/g, `href="${domain}`);
  html = html.replace(new RegExp(`${domain}http`, 'g'), 'http');
  html = html.replace(new RegExp(`${domain}//`, 'g'), '//');

  return html;
}
