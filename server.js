const http = require('http');
const app = require('./app');
require('dotenv').config();

app.set('port', process.env.APP_PORT);

const server = http.createServer(app);

server.listen(process.env.APP_PORT, () => {
    console.log('URL server : http://localhost:'+ process.env.APP_PORT);
});