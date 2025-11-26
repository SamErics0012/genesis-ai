const { spawn } = require('child_process');

// Filter out --host and its value
const args = process.argv.slice(2);
const newArgs = [];
let skip = false;

for (const arg of args) {
  if (skip) {
    skip = false;
    continue;
  }
  if (arg === '--host') {
    skip = true;
    continue;
  }
  if (arg.startsWith('--host=')) {
    continue;
  }
  newArgs.push(arg);
}

// Add -H 0.0.0.0 if not present
if (!newArgs.includes('-H') && !newArgs.includes('--hostname')) {
  newArgs.push('-H', '0.0.0.0');
}

const child = spawn('next', ['dev', ...newArgs], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  process.exit(code);
});
