'use strict';

const path = require('node:path');
const beforeExec = require('./src/lib/beforeExec.js');
const spawn = require('./src/lib/spawn.js');
const config = require('./timon.json');
const Watcher = require('ezwatch');

const boot = async () => {
  console.log({ path: process.cwd(), argv: process.argv });
  const file = process.argv[2];
  if (!file) {
    const msg = 'Enter a 2rd param! Like: "livemon server.js"\n';
    process.stdout.write(msg);
    process.exit(0);
  }
  await beforeExec(config);
  const dir = process.cwd();
  const options = { ignore: { ...config.ignore }, timeout: config.delay };
  const watcher = new Watcher(options).watch(dir);
  const filePath = path.join(dir, file);
  const restart = spawn(filePath, config);
  watcher.on('change', () => void restart());
};

module.exports = boot;
