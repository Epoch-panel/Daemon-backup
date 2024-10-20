/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
module.exports = async function () {
app.get('/servers/resize', utils.auth, async (req, res) => {
    const d = path.resolve('/home', 'servers', serverId);
    const serverId = req.body.serverId;
    const container = docker.getContainer(serverId);
    const { ram, cpu, disk } = req.body;
    const f = await db.get(serverId);

    if (!ram || !cpu || !disk ) {
        return res.status(400).json({ error: 'Missing ram or cpu or disk parameters' });
    }

    const a = {
        Memory: ram * 1024 * 1024,
        MemoryReservation: ram * 1024 * 1024,
        MemorySwap: -1,
        CpuQuota: cpu > 0 ? cpu * 1000 : -1,
        CpuPeriod: 100000,
        CpuShares: cpu
    };

    container.update(a, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update container.' });
        }
        res.status(200).json({ error: 'Action completed succesfully'})
  });
});
};
