/*
Genesis - Holaclient-E Daemon
This code shall not be distributed publicly
Made by Demon
*/
const fs = require('fs');
const path = require('path');
const db_path = path.join(__dirname, '../../storage/db.json');

function load_db() {
    if (!fs.existsSync(db_path)) fs.writeFileSync(db_path, '{}');
    return JSON.parse(fs.readFileSync(db_path, 'utf8'));
}

function save_db(data) {
    fs.writeFileSync(db_path, JSON.stringify(data));
}

function set(key, value) {
    const db = load_db();
    db[key] = value;
    save_db(db);
}

function get(key) {
    const db = load_db();
    return db[key];
}

function del(key) {
    const db = load_db();
    delete db[key];
    save_db(db);
}

function clear() {
    save_db({});
}

function get_all() {
    return load_db();
}

module.exports = { set, get, del, clear, get_all };
