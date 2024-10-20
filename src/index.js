/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
require('./modules/modules.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  async function load(g) {
    const a = fs.readdirSync(g);

    for (const b of a) {
      const c = path.join(g, b);
      const d = fs.statSync(c);
      if (d.isDirectory()) {
        await load(c);
        console.log(d)
      } else if (b.endsWith('.js')) {
        const e = require(c);
        if (typeof e === 'function') {
          await e();
          console.log(e)
        }
      }
    }
  }
  const r = path.resolve(__dirname, 'routes');
  await load(r);
})();


const server = new Server({
  hostKeys: [fs.readFileSync('host.key')],
  algorithms: {
    kex: ['diffie-hellman-group14-sha1'],
    cipher: ['aes256-cbc'],
    hmac: ['hmac-sha2-256']
  }
}, (client) => {
    client.on('authentication', async (ctx) => {
        if (ctx.method === 'password') {
            const sftpId = client.username.split('_')[0];
            const idk = await db.get(sftpId);

            if (idk && ctx.password === idk.password) {
                ctx.accept();
            } else {
                ctx.reject();
            }
        } else {
            ctx.reject();
        }
    });

    client.on('ready', () => {
        client.on('session', (accept, reject) => {
            const session = accept();

            session.on('sftp', (accept, reject) => {
                const sftp = accept();

                const sftpId = client.username.split('_')[0];
                const ptsftp = (db.get(sftpId))?.psftp;

                if (ptsftp) {
                    sftp.on('OPEN', (reqid, filename, flags, attrs) => {
                        const fullPath = path.join(ptsftp, filename);
                        fs.open(fullPath, flags, attrs.mode, (err, handle) => {
                            if (err) {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                                return;
                            }
                            sftp.handle(reqid, handle);
                        });
                    });

                    sftp.on('READDIR', (reqid, handle) => {
                        fs.readdir(ptsftp, (err, files) => {
                            if (err) {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                            } else {
                                const items = files.map((file) => {
                                    const stats = fs.statSync(path.join(ptsftp, file));
                                    return {
                                        filename: file,
                                        attrs: {
                                            mode: stats.mode,
                                            size: stats.size,
                                            uid: stats.uid,
                                            gid: stats.gid,
                                            atime: stats.atimeMs,
                                            mtime: stats.mtimeMs
                                        }
                                    };
                                });
                                sftp.name(reqid, items);
                            }
                        });
                    });

                    sftp.on('READ', (reqid, handle, offset, len) => {
                        fs.read(handle, Buffer.alloc(len), 0, len, offset, (err, bytesRead, buffer) => {
                            if (err) {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                            } else {
                                sftp.data(reqid, buffer);
                            }
                        });
                    });

                    sftp.on('WRITE', (reqid, handle, offset, data) => {
                        fs.write(handle, data, 0, data.length, offset, (err, bytesWritten) => {
                            if (err) {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                            } else {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
                            }
                        });
                    });

                    sftp.on('DOWNLOAD', (reqid, handle, offset, len) => {
                        fs.read(handle, Buffer.alloc(len), 0, len, offset, (err, bytesRead, buffer) => {
                            if (err) {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                            } else {
                                sftp.data(reqid, buffer);
                            }
                        });
                    });

                    sftp.on('EDIT', (reqid, handle, offset, data) => {
                        fs.write(handle, data, 0, data.length, offset, (err, bytesWritten) => {
                            if (err) {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                            } else {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
                            }
                        });
                    });

                    sftp.on('UPLOAD', (reqid, handle, offset, data) => {
                        fs.write(handle, data, 0, data.length, offset, (err, bytesWritten) => {
                            if (err) {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                            } else {
                                sftp.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
                            }
                        });
                    });

                } else {
                    reject('Invalid SFTP ID');
                }
            });
        });
    });
});

const host = db.get('nodeUrl');
server.listen(2022, host, () => {
  console.log('SFTP server listening on port 2022');
});

async function k() {
  try {
    const j = await docker.listContainers();
    for (const o of j) {
      const l = docker.getContainer(o.Id);
      const m = l.Labels.serverId;
      const f = await db.get(m);

      if (!f || !f.disk) {
        console.error(`Cannot get disk for: ${serverId}`);
        return;
      }

      const g = f.disk;
      const stats = await l.stats();
      const h = stats.storage_stats.usage;

      if (h > g) {
        await l.stop();
        await l.remove();
      }
    }
  } catch (err) {
    console.log('Error:', err);
  }
}

setInterval(k, 60000);

app.listen(9090, () => {
  console.log(`Server running on port 9090`);
});
