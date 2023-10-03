'use strict';

const fsp = require('node:fs/promises');

const isExist = async (filePath) => {
  const toBool = [() => true, () => false];
  const exist = await fsp.access(filePath).then(...toBool);
  return exist;
};

const throttle = (timeout, fn, ...args) => {
  let timer = null;
  let wait = false;

  const execute = args ?
    (...pars) => (pars ? fn(...args, ...pars) : fn(...args)) :
    (...pars) => (pars ? fn(...pars) : fn());

  const delayed = (...pars) => {
    timer = null;
    if (wait) execute(...pars);
  };

  const throttled = (...pars) => {
    if (!timer) {
      timer = setTimeout(delayed, timeout, ...pars);
      wait = false;
      execute(...pars);
    }
    wait = true;
  };
  return throttled;
};

module.exports = { isExist, throttle };
