import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';

const app = express();
const router = Router();
const web_server = require('http').Server(app);
const io = require('socket.io')(web_server);
const backend_service = require('./src/server');

// -----------------express app------------------------------------

app.use(cookieParser());
app.use(json());

app.use('/', router);

app.use(express.static('web'));


//-----------------------------------------------------------
const port = 3000;
web_server.listen(port, () => {
  console.log(`Web Server and Web Socket are, Live at Port:${port}`);
});

//------------------start backend service-------------

function back_end_service(){
  backend_service.BACK_END_SERVICE(io);
}
setTimeout(back_end_service, 10000);

//--------------------------------------------------------
