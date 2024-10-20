/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
module.exports = async function () {
    app.post('/servers/create', async (req, res) => {
        try {
            const { image, installImage, env, ram, cpu, disk, password, sftpId, port, serverId, startup, install } = req.body;

            if (!image || !installImage || !env || !ram || !cpu || !disk || !password || !sftpId || !port || !serverId || !startup) {
                return res.status(400).send('Missing required fields in request body');
            }
            const a = path.resolve('/home', 'servers', serverId);
            const psftp = path.resolve('/home', 'servers', serverId, 'home', 'container');
            await db.set(sftpId, { password, psftp })
            await db.set(serverId, { disk })

            await docker.pull(installImage)

            await docker.pull(image)

            const env1 = env.split(',').map(variable => variable.trim());
            const env2 = env1.map(variable => `${variable}`);

            env2.push(`SERVER_MEMORY=${ram}`);


            const tempcont = await docker.createContainer({
                Image: installImage,
                name: `${serverId}-install`,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                OpenStdin: true,
                Tty: true,
                Env: env2,
                Cmd: [
                    'bash',
                    '-c',
                    install.replace(/\r\n/g, '\n'),
                ],
                ExposedPorts: {
                    [`${port}/tcp`]: {}
                },
                HostConfig: {
                    PortBindings: {
                        [`${port}/tcp`]: [{ HostPort: `${port}` }]
                    },
                    Binds: [`${a}:/home/container:z`],
                    Memory: ram * 1024 * 1024,
                    MemoryReservation: ram * 1024 * 1024,
                    MemorySwap: -1,
                    CpuQuota: (cpu > 0) ? cpu * 1000 : -1,
                    CpuPeriod: 100000,
                    CpuShares: cpu,
                    NetworkMode: 'bridge'
                }
            });
            await tempcont.start();

            console.log('Streaming logs for Installation Container:');
            const logStream1 = await tempcont.logs({
                follow: true,
                stdout: true,
                stderr: true
            });
            logStream1.setEncoding('utf8');
            logStream1.on('data', chunk => {
                process.stdout.write(chunk);
            });

            await new Promise((resolve, reject) => {
                tempcont.wait((err, data) => {
                    if (err) {
                        console.error('Installation container wait error:', err);
                        reject(err);
                    } else {
                        console.log('Installation completed');
                        resolve();
                    }
                });
            });

            await tempcont.remove();

            console.log(env2)

            console.log(image)

            const permcont = await docker.createContainer({
                Image: image,
                name: serverId,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                OpenStdin: true,
                Tty: true,
                Cmd: [
                    'bash',
                    '-c',
                    startup
                ],
                Env: env2,
                ExposedPorts: {
                    [`${port}/tcp`]: {}
                },
                HostConfig: {
                    PortBindings: {
                        [`${port}/tcp`]: [{ HostPort: `${port}` }]
                    },
                    Binds: [`${a}:/home/container:z`],
                    Memory: ram * 1024 * 1024,
                    MemoryReservation: ram * 1024 * 1024,
                    MemorySwap: -1,
                    CpuQuota: (cpu > 0) ? cpu * 1000 : -1,
                    CpuPeriod: 100000,
                    CpuShares: cpu,
                    NetworkMode: 'bridge'
                }
            });

            await permcont.start();

            const logStream2 = await permcont.logs({
                follow: true,
                stdout: true,
                stderr: true
            });
            logStream2.setEncoding('utf8');
            logStream2.on('data', chunk => {
                process.stdout.write(chunk);
            });

            res.send({ serverId, port, message: 'Your server has been created successfully.' });

        } catch (err) {
            console.error('Error creating server:', err);
            res.status(500).send('Failed to create server');
        }
    });
};
