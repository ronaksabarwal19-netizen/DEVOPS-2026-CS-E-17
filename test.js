import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import { once } from 'node:events';
import process from 'node:process';

const host = '127.0.0.1';
const port = 4173;
const baseUrl = `http://${host}:${port}`;

const routes = [
  '/',
  '/signup',
  '/dashboard',
  '/accounts',
  '/payments',
  '/cards',
  '/investments',
  '/settings'
];

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: false
    });

    child.once('error', reject);

    child.once('exit', (exitCode) => {
      if (exitCode === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${exitCode}`));
      }
    });
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // Vite is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Preview server did not start at ${baseUrl}`);
}

async function testRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);

  if (!response.ok) {
    throw new Error(`${route} returned HTTP ${response.status}`);
  }

  const html = await response.text();

  if (!html.includes('<div id="root"></div>')) {
    throw new Error(`${route} did not return the React app shell`);
  }
}

async function main() {
  try {
    await access(new URL('./package.json', import.meta.url));
  } catch {
    throw new Error(
      'package.json was not found. Configure Jenkins to build the project root and the master branch.'
    );
  }

  await run('npm', ['ci']);
  await run('npm', ['run', 'build']);

  const server = spawn(
    'npm',
    ['run', 'preview', '--', '--host', host, '--port', String(port)],
    {
      stdio: 'inherit',
      shell: false
    }
  );

  try {
    await waitForServer();

    for (const route of routes) {
      await testRoute(route);
      console.log(`PASS ${route}`);
    }

    console.log(`\nAll ${routes.length} website smoke tests passed.`);
  } finally {
    server.kill('SIGTERM');
    await once(server, 'exit').catch(() => {});
  }
}

main().catch((error) => {
  console.error(`\nTEST FAILED: ${error.message}`);
  process.exitCode = 1;
});