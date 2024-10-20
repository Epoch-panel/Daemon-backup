/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const utils = require('./src/modules/utils')
const a = fs.readFileSync('./app/storage/ascii.txt', 'utf8');
console.log(a);

const b = os.type();
const db = require('./src/modules/db');

(async () => {
    const nodeUrl = await utils.noname('Enter Node IP/URL: ');
    const key = await utils.noname('Enter key: ');
    const panelUrl = await utils.noname('Enter Panel URL: ');

    await db.set('nodeUrl', nodeUrl);
    await db.set('key', key);
    await db.set('panelUrl', panelUrl);

    const l = b === '/var/run/docker.sock';
    const g = { c: l };
    fs.writeFileSync('config.json', JSON.stringify(g, null, 2));

    if (b !== 'Linux') {
        console.log(`Unfortunately, Holaclient-E is not yet equipped to support ${b}. Thank you for showing interest on this project, we might support ${b} in te upcoming future`);
        return;
    }

    process.stdin.pause();
})();
