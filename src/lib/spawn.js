'use strict';

const path = require('node:path');
const { spawn } = require('node:child_process');

const getExec = (file, options) => {
  const ext = path.extname(file).slice(1);
  const { execMap = {} } = options;
  const exec = execMap[ext];
  return exec;
};

module.exports = (file, options = {}) => {
  console.log('Livemon is listening!', 'PID:' + process.pid);
  const exec = getExec(file, options);
  if (!exec) throw new Error('Executor not found!');
  const { params = [], env = {}, delay = 0 } = options;
  const spawnOptions = {
    stdio: 'inherit',
    cwd: path.dirname(process.argv[2]),
    env: { ...process.env, ...env },
  };
  let child = spawn(exec, [...params, file], spawnOptions);
  return () => {
    setTimeout(() => {
      child.kill();
      child = spawn(exec, [...params, file], spawnOptions);
    }, delay);
  };
};
