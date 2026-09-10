import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PORT = 8787;
const DEPLOYED = 'https://delicateses.vercel.app';
const LOCAL = 'http://127.0.0.1:4321';
const SECRET = randomBytes(32).toString('hex');

const manifest = {
  name: 'DePonteJuan Keystatic Delicateses',
  url: `${DEPLOYED}/keystatic`,
  public: true,
  redirect_url: `http://127.0.0.1:${PORT}/callback`,
  callback_urls: [
    `${DEPLOYED}/api/keystatic/github/oauth/callback`,
    `${LOCAL}/api/keystatic/github/oauth/callback`,
    `http://127.0.0.1/api/keystatic/github/oauth/callback`,
  ],
  request_oauth_on_install: true,
  default_permissions: {
    contents: 'write',
    metadata: 'read',
    pull_requests: 'read',
  },
};

const setupHtml = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"/><title>Crear GitHub App — Keystatic</title></head>
<body style="font-family:system-ui;max-width:40rem;margin:3rem auto;padding:0 1rem">
  <h1>Crear GitHub App para Keystatic</h1>
  <p>Se abrirá GitHub para crear la app. Confirma el nombre y pulsa <strong>Create GitHub App</strong>.</p>
  <form id="f" action="https://github.com/settings/apps/new" method="post">
    <input type="hidden" name="manifest" value='${JSON.stringify(manifest).replace(/'/g, '&#39;')}' />
    <button type="submit" style="font-size:1.1rem;padding:0.75rem 1.25rem;cursor:pointer">Continuar en GitHub</button>
  </form>
  <script>document.getElementById('f').submit()</script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`);

  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(setupHtml);
    return;
  }

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400, { 'content-type': 'text/plain' });
      res.end('Falta code en el callback');
      return;
    }

    try {
      const ghRes = await fetch(
        `https://api.github.com/app-manifests/${code}/conversions`,
        {
          method: 'POST',
          headers: { Accept: 'application/json', 'User-Agent': 'delicateses-keystatic-setup' },
        },
      );
      const data = await ghRes.json();
      if (!ghRes.ok) {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
        return;
      }

      const env = {
        PUBLIC_WHATSAPP_NUMBER: '584127099331',
        PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: 'DePonteJuan',
        PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: 'delicateses',
        KEYSTATIC_GITHUB_CLIENT_ID: data.client_id,
        KEYSTATIC_GITHUB_CLIENT_SECRET: data.client_secret,
        KEYSTATIC_SECRET: SECRET,
        PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: data.slug,
      };

      const root = new URL('..', import.meta.url);
      writeFileSync(
        new URL('.env.keystatic-generated.json', root),
        JSON.stringify(
          {
            ...env,
            html_url: data.html_url,
            id: data.id,
            install_url: `https://github.com/apps/${data.slug}/installations/new`,
          },
          null,
          2,
        ),
      );

      const envFile = Object.entries(env)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');
      writeFileSync(new URL('.env', root), envFile + '\n');

      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html><html><body style="font-family:system-ui;max-width:40rem;margin:3rem auto">
        <h1>GitHub App creada</h1>
        <p>Slug: <code>${data.slug}</code></p>
        <p>Ahora <a href="https://github.com/apps/${data.slug}/installations/new">instala la app en el repo delicateses</a> (elige solo ese repositorio).</p>
        <p>Puedes cerrar esta ventana; el script sigue en la terminal.</p>
      </body></html>`);

      console.log(JSON.stringify({ ok: true, slug: data.slug, client_id: data.client_id }));
      setTimeout(() => process.exit(0), 500);
    } catch (err) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end(String(err));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}/`;
  console.log(`Abre: ${url}`);
  try {
    execSync(`start ${url}`, { stdio: 'ignore', shell: true });
  } catch {
    // ignore
  }
});
