/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
global.fs = require('fs');
global.db = require('./db')
global.path = require('path');
global.app = require('./server.js')();
global.docker = require('./docker');
global.config = require('../config.json');
global.WebSocket = require('ws');
global.wss = require('ws');
global.parser = require('./parser')
const { exec } = require('child_process');
global.exec = exec;
const { Server } = require('ssh2');
global.Server = Server
global.utils = require('./utils.js')