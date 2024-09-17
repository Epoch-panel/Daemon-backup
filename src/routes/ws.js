module.exports = async function () {
app.ws('/ws/:serverId', (ws, req) => {
  
    const serverId = req.params.serverId;
    const container = docker.getContainer(serverId);
  
    container.logs({ follow: true, stdout: true, stderr: true }, (err, stream) => {
      if (err) {
        ws.send(JSON.stringify({ error: err.message }));
        return;
      }
  
      stream.on('data', (chunk) => {
        ws.send(chunk.toString());
      });
  
      stream.on('end', () => {
        ws.send(JSON.stringify({ info: 'Log stream ended' }));
      });
  
      stream.on('error', (err) => {
        ws.send(JSON.stringify({ error: err.message }));
      });
    });
  
    ws.on('message', (message) => {
      let a;
      try {
        a = JSON.parse(message);
      } catch (error) {
        ws.send(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }
  
      ws.send(`\x1b[33mE1@daemon\x1b[0mconsole is alive!`);
  
      switch (a.event) {
        case 'cmd':
          s(ws, serverId, a.command);
          break;
        default:
          ws.send(JSON.stringify({ error: 'Event 404' }));
          break;
      }
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}
function s(ws, serverId, command) {
    const container = docker.getContainer(serverId);
    container.exec({
      Cmd: f(command),
      AttachStdout: true,
      AttachStderr: true
    }, (err, exec) => {
      if (err) {
        ws.send(JSON.stringify({ error: 'Failure reported.' }));
        return;
      }
      exec.start((err, stream) => {
        if (err) {
          ws.send(JSON.stringify({ error: 'Checkout the error.' }));
          return;
        }
        stream.on('data', (data) => {
          ws.send(JSON.stringify({ output: data.toString() }));
        });
      });
    });
  }
  
  function f(command) {
    return command.split(' ');
  }