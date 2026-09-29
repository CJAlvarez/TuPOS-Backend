// Runs a command with the ports/origins assigned by Dev-Ports-Admin.
// Usage: node scripts/with-dev-ports.mjs nest start --watch
import { spawn } from 'node:child_process';
import { constants } from 'node:os';

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
