/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
const auth = async (req, res, next) => {
    const b = req.headers['authorization'];
    if (!b) {
        return res.status(401).send('Fuck off.');
    }
    const c = await db.get('key');
    if (b !== c) {
        return res.status(403).send('Fuck off.');
    }
    next();
};

async function noname(text) {
    process.stdout.write(text);
    return new Promise((resolve) => {
        process.stdin.once('data', (data) => resolve(data.toString().trim()));
    });
}

module.exports = {
    auth,
    noname
};