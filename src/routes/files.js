/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
module.exports = async function () {
    app.post('/api/files/', utils.auth, async (req, res) => {
        try {
            const serverId = req.body.serverId;
            const a = req.body.path;
            const d = path.resolve('/home', 'servers', serverId);
            const e = path.join(d, a);
            const f = req.body.content || '';

            fs.writeFileSync(e, f);
            
            res.status(200).send('File created successfully.');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to create file.');
        }
    });

    app.post('/api/folder/', async (req, res) => {
        try {
            const b = req.headers['authorization'];
            if (!b) {
                return res.status(401).send('Fuck off.');
            }
            const c = await db.get('key');
            if (b !== c) {
                return res.status(403).send('Fuck off.');
            }
            const o = req.body.serverId;
            const l = req.body.path;
            const g = path.resolve('/home', 'servers', o);
            const n = path.join(g, l);

            if (req.body.type === "true") {
      fs.mkdirSync(targetPath, { recursive: true });
      res.status(200).send({ message: "Folder created successfully." });
    } else {
      fs.writeFileSync(targetPath, content || "");
      res.status(200).send({ message: "File created successfully." });
    }

            res.status(200).send('Folder created successfully.');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to create folder.');
        }
    });
    app.delete('/api/files/', async (req, res) => {
        try {
            const b = req.headers['authorization'];
            if (!b) {
                return res.status(401).send('Fuck off.');
            }
            const c = await db.get('key');
            if (b !== c) {
                return res.status(403).send('Fuck off.');
            }
            const o = req.body.serverId;
            const a = req.body.path;
            const d = path.resolve('/home', 'servers', o);
            const e = path.join(d, a);

            fs.rmSync(e, { recursive: true });

            res.status(200).send('Action successfully completed');
        } catch (error) {
            console.error(error);
            res.status(500).send('Action failed.');
        }
    });
    app.post('/api/files/edit/', async (req, res) => {
        try {
            const b = req.headers['authorization'];
            if (!b) {
                return res.status(401).send('Fuck off.');
            }
            const c = await db.get('key');
            if (b !== c) {
                return res.status(403).send('Fuck off.');
            }
            const serverId = req.body.serverId;
            const f = req.body.content;
            const a = path.resolve('/home', 'servers', serverId);
            const d = req.body.path;
            const e = path.join(a, d);
    
            fs.writeFileSync(e, f);
            
            res.status(200).send('File edit successfully.');
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to edit to file.');
        }
    });
    app.get('/api/files/', async (req, res) => {
            const b = req.headers['authorization'];
            if (!b) {
                return res.status(401).send('Fuck off.');
            }
            const c = await db.get('key');
            if (b !== c) {
                return res.status(403).send('Fuck off.');
            }
            const serverId = req.body.serverId;
            const d = req.body.path || '/';
            const e = path.resolve('/home', 'servers', serverId);
            const f = path.join(e, d);

            if (!fs.existsSync(f)) return res.status(400).json({ error: 'Directory does not exist' });
            if (!fs.lstatSync(f).isDirectory()) return res.status(400).json({ error: 'Path is not a directory' });
        
            const r = g(f);
            res.json({ files: r });
    });

    app.post('/api/rename', (req, res) => {
        const b = req.headers['authorization'];
            if (!b) {
                return res.status(401).send('Fuck off.');
            }
            const p = db.get('key');
            if (b !== p) {
                return res.status(403).send('Fuck off.');
            }
        const a = req.body.serverId;
        const d = req.body.ex;
        const f = req.body.sec;
        const c = path.resolve('/home', 'servers', a);
        const l = path.join(c, d);
        const o = path.join(c, f);
    
        if (!fs.existsSync(l)) return res.status(400).json({ error: 'Original file or directory does not exist' });
    
        fs.rename(l, o, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to rename file or directory' });
            res.json({ success: true });
        });
    });
};

async function g(d) {
    let r = [];
    const l = fs.readdirSync(d);
    l.forEach((f) => {
        const p = path.join(d, f);
        const s = fs.lstatSync(p);
        if (s.isDirectory()) {
            r.push({ path: p, type: 'directory', contents: g(p) });
        } else {
            r.push({ path: p, type: 'file' });
        }
    });
    return r;
};