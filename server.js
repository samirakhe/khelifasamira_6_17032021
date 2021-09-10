const http = require('http');
const app = require('./app');
require('dotenv').config();


//app.set('port', process.env.PORT || 3000);
app.set('port', process.env.APP_PORT);

const server = http.createServer(app);

//server.listen(process.env.PORT || 3000);
server.listen(process.env.APP_PORT);