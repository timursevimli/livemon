'use strict';

const fsp = require('node:fs/promises');

const isExist = async (filePath) => {
  const toBool = [() => true, () => false];
  const exist = await fsp.access(filePath).then(...toBool);
  return exist;
};

module.exports = { isExist };
