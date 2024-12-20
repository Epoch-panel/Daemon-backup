/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
module.exports = async function () {
    app.post('/servers/resources', utils.auth, async (req, res) => {
        try {
            const serverId = req.body.serverId;
            const container = docker.getContainer(serverId);
            const a = await container.stats({ stream: false });
    
            const ram = a.memory_stats.usage;
            const disk = a.diskio_service_bytes;
            const cpu = a.cpu_stats.cpu_usage.total_usage;
    
            res.json({ ram, disk, cpu });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error: 500.');
        }
    });
};
