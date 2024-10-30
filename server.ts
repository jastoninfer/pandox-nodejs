import express, {Application} from 'express';
import cors, {CorsOptions} from 'cors';
import http, {Server as HttpServer} from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

import routes from './app/routes';

import init from './init';


const app: Application = express();

const corsOptions:CorsOptions = {
    origin: '*',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

const PORT = process.env.PORT || 8080;

// Init WebSocket
const server:HttpServer = http.createServer(app);

export const wsServer:WebSocketServer = new WebSocketServer({ server });

(async () => {
    try {
        await init();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });

        // server.listen(8000, () => {
        //     console.log(`WebSocket server is running on port 8000`);
        // });

        wsServer.on('connection', (ws) => {
            console.log('WSS Client connected');
            ws.on('message', (message) => {
                // console.log('received message: ', message);
            });
        });
    } catch (err) {
        console.error('Failed to sync db or failed to init database: ', err);
    }
})();
