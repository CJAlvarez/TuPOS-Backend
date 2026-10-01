// Runs a command with the ports/origins assigned by Dev-Ports-Admin.
// Usage: node scripts/with-dev-ports.mjs nest start --watch
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { constants } from 'node:os';
import { parseEnv } from 'node:util';

const ENV_FILE = '.dev-ports.env';

try {
  process.loadEnvFile(ENV_FILE);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.error(`Missing ${ENV_FILE}. Run "dev-ports apply" and try again.`);
  process.exit(1);
}

const { DEV_PORTS_API_PORT, DEV_PORTS_ROOT_ORIGIN } = process.env;
if (!DEV_PORTS_API_PORT || !DEV_PORTS_ROOT_ORIGIN) {
  console.error(`${ENV_FILE} must define DEV_PORTS_API_PORT and DEV_PORTS_ROOT_ORIGIN.`);
  process.exit(1);
}

// Assigned explicitly so they win over shell values. ConfigModule (.env) never
// overrides variables already present in process.env, so they win over .env too.
process.env.PORT = DEV_PORTS_API_PORT;
process.env.FRONTEND_URL = DEV_PORTS_ROOT_ORIGIN;
// The ingress reaches the app over loopback; do not expose it on the LAN.
process.env.LISTEN_HOST = '127.0.0.1';

// Shared infra ports (Dev-Ports-Admin `infra`). Optional: nothing changes
// while the variables are absent from `.dev-ports.env`.
// The app only loads .env after this wrapper, so read it here (without touching
// process.env) to tell whether the backend targets a local database. The real
// environment wins over the file, like ConfigModule.
const APP_ENV_FILES = ['.env'];

function effectiveEnv(name) {
  if (process.env[name] !== undefined) return { value: process.env[name] };
  for (const file of APP_ENV_FILES) {
    let content;
    try {
      content = readFileSync(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      // Unreadable (EACCES, EISDIR, ...): the host is unknown, not "unset".
      return { unreadable: `could not read ${file}: ${error.code ?? 'unknown error'}` };
    }
    try {
      const value = parseEnv(content)[name];
      if (value !== undefined) return { value };
    } catch {
      return { unreadable: `could not parse ${file}` };
    }
  }
  return {};
}

function isLocalHost(host) {
  if (!host) return true;
  const value = host.trim().toLowerCase().replace(/^\[|\]$/g, '');
  const octet = '(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)';
  return (
    value === 'localhost' ||
    value === '::1' ||
    new RegExp(`^127(?:\\.${octet}){3}$`).test(value)
  );
}

function mapInfraPort(target, source) {
  console.error(`dev-ports: ${target} <- ${source} (${process.env[source]})`);
}

function skipInfraPort(target, reason) {
  console.error(`dev-ports: ${target} not mapped (${reason})`);
}

// True only when `hostVar` is known to be local. Logs why otherwise.
function targetsLocalHost(target, hostVar) {
  const { value, unreadable } = effectiveEnv(hostVar);
  if (unreadable) return skipInfraPort(target, unreadable), false;
  if (!isLocalHost(value)) return skipInfraPort(target, `${hostVar} is not local`), false;
  return true;
}

const { DEV_PORTS_INFRA_DB_PORT } = process.env;
// Never redirect a remote database (Railway, etc.) to the local container.
if (DEV_PORTS_INFRA_DB_PORT && targetsLocalHost('DB_PORT', 'DB_HOST')) {
  process.env.DB_PORT = DEV_PORTS_INFRA_DB_PORT;
  mapInfraPort('DB_PORT', 'DEV_PORTS_INFRA_DB_PORT');
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error('Usage: node scripts/with-dev-ports.mjs <command> [args...]');
  process.exit(1);
}

// shell on Windows: npm/nest binaries there are .cmd shims.
const child = spawn(command, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

child.on('error', (error) => {
  console.error(`Failed to start "${command}": ${error.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  process.exit(code ?? 128 + (constants.signals[signal] ?? 0));
});
