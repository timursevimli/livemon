'use strict';

const path = require('node:path');
const cp = require('node:child_process');
const { throttle } = require('./utils');

const THROTTLE_TIME = 1000;

const getExec = (file, execMap) => {
  const ext = path.extname(file).slice(1);
  const exec = execMap[ext];
  return exec;
};

const spawn = (filePath, options) => {
  const { params, env, delay, stdio, execMap } = options;
  params.push(filePath);
  const exec = getExec(filePath, execMap);
  if (!exec) {
    process.stdout.write('Executor not found! Need configure execMap.\n');
    process.exit(1);
  }
  const spawnOptions = { stdio, env: { ...process.env, ...env } };
  let child = cp.spawn(exec, [...params], spawnOptions);
  process.stdout.write('Livemon is listening!\n');
  const restart = () => {
    child.kill('SIGKILL');
    child.on('exit', () => {
      setTimeout(() => {
        child = cp.spawn(exec, [...params, filePath], spawnOptions);
      }, delay);
    });
  };
  return throttle(THROTTLE_TIME, restart);
};

module.exports = { spawn };
