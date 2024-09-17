/*modules.exports = async function () {
    app.post('/databases/create', async (req, res) => {
        const { type, name, host, user, password, port } = req.body;
      
        try {
          if (type === 'mysql') {
            const connection = await mysql.createConnection({ host, user, password });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``);
            await connection.end();
          } else if (type === 'redis') {
            const client = redis.createClient({ host });
            client.select(name);
            client.quit();
          } else if (type === 'mongodb') {
            const client = new MongoClient(`mongodb://${user}:${password}@${host}:${port}`);
            await client.connect();
            const db = client.db(name);
            await db.createCollection('dummy');
            await client.close();
          } else {
            return res.status(400).send('Unsupported database type');
          }
          res.send('Database created successfully');
        } catch (error) {
          console.error(error);
          res.status(500).send('Failed to create database');
        }
      });
    };
    */
   //Note for my future self: This is absolute shit so delete it later.