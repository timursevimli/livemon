'use strict';

const { exec, execSync } = require('node:child_process');
const path = require('node:path');

module.exports = async (options = {}) => {
  const commands = options?.before?.commands || [];
  if (commands.length === 0) return;
  const stdio = options?.before?.stdio;
  const cwd = path.dirname(process.argv[1]);
  for (const command of commands) {
    if (!Array.isArray(command)) {
      execSync(command, { stdio, cwd });
      continue;
    }
    const promises = [];
    for (const cmd of command) {
      const promise = new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (err, stdout, stderr) => {
          if (err) return void reject(err);
          if (stdio === 'inherit' || stdio === 'pipe') {
            process.stdout.write(stdout);
            process.stderr.write(stderr);
          }
          resolve();
        });
      });
      promises.push(promise);
    }
    await Promise.all(promises);
  }
};
