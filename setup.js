const { execSync } = require('child_process');
const fs = require('fs');
const Keyv = require('keyv');
const figlet = require('figlet');
const readline = require('readline');
const os = require('os');

const a = figlet.textSync('Genesis', {
    font: 'Big',
    horizontalLayout: 'default',
    verticalLayout: 'default'
});

console.log(a);

const b = os.type();
const db = new Keyv('sqlite://database.sqlite');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let disksize;

rl.question('Enter Node IP/URL: ', async (nodeUrl) => {
    nodeUrl = nodeUrl.trim();
    rl.question('Enter key: ', async (key) => {
        key = key.trim();
        rl.question('Enter Panel URL: ', async (panelUrl) => {
            panelUrl = panelUrl.trim();
                await db.set('nodeUrl', nodeUrl);
                await db.set('key', key);
                await db.set('panelUrl', panelUrl);

                const l = b === 'Windows_NT' ? '//./pipe/docker_engine' : '/var/run/docker.sock';
                const g = { c: l };
                fs.writeFileSync('config.json', JSON.stringify(g, null, 2));

                if (b === 'Linux') {
                    part();
                }

                rl.close();
        });
    });
});

function part() {
    if (!b === 'Linux') {
        console.log('Holaclient-E currently supports Linux only.');
        return;
    }

}
