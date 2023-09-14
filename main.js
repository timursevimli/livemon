'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { spawn, beforeExec } = require('./lib');
const load = require('./lib/config/load.js');
const Watcher = require('ezwatch');

const main = async (pathName) => {
  const fileName = process.argv[2];
  if (!fileName) {
    process.stdout.write('Enter a 2rd param! Like: "livemon server.js"\n');
    process.exit(1);
  }
  const filePath = path.join(pathName, fileName);
  fs.accessSync(filePath);
  const config = await load(pathName);
  await beforeExec(config);
  const options = { ignore: { ...config.ignore }, timeout: config.delay };
  const watcher = new Watcher(options).watch(pathName);
  const restart = spawn(filePath, config);
  watcher.on('change', () => void restart());
};

module.exports = main;
