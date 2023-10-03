'use strict';

const path = require('node:path');
const defaults = require('./defaults.js');
const { isExist } = require('../utils.js');

const CONFIG_FILE = 'livemon.json';
const PKG_FILE = 'package.json';

const getConfig = async (pathName) => {
  const configPath = path.join(pathName, CONFIG_FILE);
  const configExist = await isExist(configPath);
  if (configExist) return require(configPath);
  const pkgPath = path.join(pathName, PKG_FILE);
  const pkgExist = await isExist(pkgPath);
  return pkgExist ? require(pkgPath).livemon : null;
};

const load = async (pathName) => {
  const userConfig = await getConfig(pathName) || {};
  const config = { ...defaults, ...userConfig };
  return config;
};

module.exports = load;
