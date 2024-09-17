module.exports = async function () {
app.get('/servers/start/', async (req, res) => {
    const b = req.headers['authorization'];
    if (!b) {
        return res.status(401).send('Fuck off.');
    }
    const c = await db.get('key');
    if (b !== c) {
        return res.status(403).send('Fuck off.');
    }
    const serverId = req.body.serverId;
    const container = docker.getContainer(serverId);
    container.start((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to start server.' });
        }
        res.status(200).json({ error: 'Action completed succesfully'})
    });
});

app.get('/servers/stop/', async (req, res) => {
    const b = req.headers['authorization'];
    if (!b) {
        return res.status(401).send('Fuck off.');
    }
    const c = await db.get('key');
    if (b !== c) {
        return res.status(403).send('Fuck off.');
    }
    const serverId = req.body.serverId;
    const container = docker.getContainer(serverId);
    const kill = req.query.kill === 'true'; 

    if (kill) {
        container.kill((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to kill server.' });
            }
            res.status(200).json({ error: 'Action completed succesfully'})
        });
    } else {
        container.stop((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to stop server.' });
            }
            res.status(200).json({ error: 'Action completed succesfully'})
        });
    }
});

app.get('/servers/restart/', async (req, res) => {
    const b = req.headers['authorization'];
    if (!b) {
        return res.status(401).send('Fuck off.');
    }
    const c = await db.get('key');
    if (b !== c) {
        return res.status(403).send('Fuck off.');
    }
    const serverId = req.body.serverId;
    const container = docker.getContainer(serverId);
    container.restart((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to restart server.' });
        }
        res.status(200).json({ error: 'Action completed succesfully'})
    });
});
};
