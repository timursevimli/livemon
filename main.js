'use strict';

const path = require('node:path');
const fsp = require('node:fs/promises');
const Watcher = require('ezwatch');
const { spawn, beforeExec } = require('./lib');
const load = require('./lib/config/load.js');

const main = async (pathName) => {
  const [fileName] = process.argv.slice(2);
  if (!fileName) {
    process.stdout.write('Enter a 2rd param! Like: "livemon server.js"\n');
    process.exit(1);
  }
  const filePath = path.join(pathName, fileName);
  await fsp.access(filePath);
  const config = await load(pathName);
  await beforeExec(config);
  const options = { ignore: { ...config.ignore }, timeout: config.delay };
  const watcher = new Watcher(options).watch(pathName);
  const restart = spawn(filePath, config);
  watcher.on('*', () => void restart());
};

module.exports = main;
