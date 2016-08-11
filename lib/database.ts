/// <reference path="../typings/index.d.ts" />
/// <reference path="../index.d.ts" />
/// <reference path="./config.ts" />

import nano = require('nano');

let Connection = nano(Config.connectionUrl);
export let Db = Connection.use(Config.databaseName);
