'use strict';

const path = require('node:path');
const cp = require('node:child_process');

const getExec = (file, execMap) => {
  const ext = path.extname(file).slice(1);
  const exec = execMap[ext];
  return exec;
};

const spawn = (filePath, options) => {
  const { params, env, delay, stdio, execMap } = options;
  const exec = getExec(filePath, execMap);
  if (!exec) {
    process.stdiot.write('Executor not found! Need configure execMap.\n');
    process.exit(1);
  }
  const spawnOptions = {
    stdio,
    cwd: filePath,
    env: { ...process.env, ...env },
  };
  process.stdout.write('Livemon is listening!\n');
  let child = cp.spawn(exec, [...params, filePath], spawnOptions);
  return () => {
    child.kill();
    child.on('exit', () => {
      if (delay === 0) {
        return void cp.spawn(exec, [...params, filePath], spawnOptions);
      }
      setTimeout(() => {
        child = cp.spawn(exec, [...params, filePath], spawnOptions);
      }, delay);
    });
  };
};

module.exports = { spawn };
