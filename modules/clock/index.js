const { spawn } = require('child_process');
const config = require('./config');

function get(callback) {
    setInterval(() => {
        const date = spawn('sh', ['-c', "date +%A%n%d/%m/%Y%n%X%n%Z"]);
        date.stdout.on('data', (data) => {
            callback(data.toString('utf-8'));
        })
    }, 1000);
}

module.exports = { get, config };