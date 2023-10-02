'use strict';

module.exports = ({
  ignore: {
    dirs: ['.git'],
    files: [],
    exts: []
  },
  stdio: 'inherit',
  execMap: {
    js: 'node',
    py: 'python'
  },
  delay: 0,
  env: {},
  params: [],
  before: {
    commands: [],
    stdio: 'inherit'
  },
});
