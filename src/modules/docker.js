/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
const http = require('http');
const path = '/var/run/docker.sock';

function request_docker_api(options, body = null, callback) {
    const req = http.request({
        socketPath: path,
        path: options.path,
        method: options.method || 'GET',
        headers: options.headers || {}
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => callback(null, res, data));
    });

    req.on('error', err => callback(err));
    if (body) req.write(body);
    req.end();
}

function listContainers(options = {}, callback) {
    const query = options.all ? '?all=1' : '';
    request_docker_api({ path: `/containers/json${query}` }, null, callback);
}

function createContainer(config, callback) {
    request_docker_api({ path: '/containers/create', method: 'POST', headers: { 'Content-Type': 'application/json' } }, JSON.stringify(config), callback);
}

function startContainer(id, callback) {
    request_docker_api({ path: `/containers/${id}/start`, method: 'POST' }, null, callback);
}

function stopContainer(id, callback) {
    request_docker_api({ path: `/containers/${id}/stop`, method: 'POST' }, null, callback);
}

function removeContainer(id, options = {}, callback) {
    const query = options.force ? '?force=1' : '';
    request_docker_api({ path: `/containers/${id}${query}`, method: 'DELETE' }, null, callback);
}

function inspectContainer(id, callback) {
    request_docker_api({ path: `/containers/${id}/json` }, null, callback);
}

function logs(id, options = {}, callback) {
    const query = `?stdout=${options.stdout ? 1 : 0}&stderr=${options.stderr ? 1 : 0}`;
    request_docker_api({ path: `/containers/${id}/logs${query}` }, null, callback);
}

function listImages(options = {}, callback) {
    request_docker_api({ path: '/images/json' }, null, callback);
}

function pull(image_name, callback) {
    request_docker_api({ path: `/images/create?fromImage=${image_name}`, method: 'POST' }, null, callback);
}

function removeImage(id, callback) {
    request_docker_api({ path: `/images/${id}`, method: 'DELETE' }, null, callback);
}

function inspectImage(id, callback) {
    request_docker_api({ path: `/images/${id}/json` }, null, callback);
}

function listVolumes(callback) {
    request_docker_api({ path: '/volumes' }, null, callback);
}

function createVolume(config, callback) {
    request_docker_api({ path: '/volumes/create', method: 'POST', headers: { 'Content-Type': 'application/json' } }, JSON.stringify(config), callback);
}

function removeVolume(name, callback) {
    request_docker_api({ path: `/volumes/${name}`, method: 'DELETE' }, null, callback);
}

function inspectVolume(name, callback) {
    request_docker_api({ path: `/volumes/${name}` }, null, callback);
}

function listNetworks(callback) {
    request_docker_api({ path: '/networks' }, null, callback);
}

function createNetwork(config, callback) {
    request_docker_api({ path: '/networks/create', method: 'POST', headers: { 'Content-Type': 'application/json' } }, JSON.stringify(config), callback);
}

function removeNetwork(id, callback) {
    request_docker_api({ path: `/networks/${id}`, method: 'DELETE' }, null, callback);
}

function inspectNetwork(id, callback) {
    request_docker_api({ path: `/networks/${id}` }, null, callback);
}

module.exports = {
    listContainers,
    createContainer,
    startContainer,
    stopContainer,
    removeContainer,
    inspectContainer,
    logs,
    listImages,
    pull,
    removeImage,
    inspectImage,
    listVolumes,
    createVolume,
    removeVolume,
    inspectVolume,
    listNetworks,
    createNetwork,
    removeNetwork,
    inspectNetwork
};
