'use strict';

const { console } = require('app/dependency/system.js');
const proc = require('app/src/proc/app.js');
const fp = require('app/src/fp/app.js');

const apps = { proc, fp };

const validateAppName = (appName) => {
  if (!appName) return 'app-name command line param required';
  else if (!(appName in apps)) return 'invalid app name';
  return null;
};

const main = () => {
  const appName = process.argv[2];
  const err = validateAppName(appName);
  if (err) {
    console.error(`error: ${err}\nusage: npm run app app-name\n`);
    process.exit(1);
  }

  const app = apps[appName];
  app();
};

main();
