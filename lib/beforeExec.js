'use strict';

const { exec, execSync } = require('node:child_process');

const beforeExec = async (options) => {
  const { commands, stdio } = options.before;
  if (commands.length === 0) return;
  for (const command of commands) {
    if (!Array.isArray(command)) {
      execSync(command, { stdio });
      continue;
    }
    const promises = [];
    for (const cmd of command) {
      const promise = new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
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

module.exports = { beforeExec };
