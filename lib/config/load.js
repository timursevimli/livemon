'use strict';

const path = require('node:path');
const defaults = require('./defaults.js');
const { isExist } = require('../utils');

const CONFIG_FILE = 'ezwatch.json';

const getConfig = async (pathName) => {
  const configPath = path.join(pathName, CONFIG_FILE);
  const exist = await isExist(configPath);
  if (exist) return require(configPath);
  const pkgPath = path.join(pathName, 'package.json');
  const pkg = require(pkgPath);
  return pkg.ezwatch || {};
};

const load = async (pathName) => {
  console.log({ pathName });
  const userConfig = await getConfig(pathName) || {};
  const config = { ...defaults, ...userConfig };
  return config;
};

module.exports = load;
