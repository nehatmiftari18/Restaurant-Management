import express from "express";
import http from "http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import initUser from './seed/index.js';
import config from "./config/config.js";
import router from "./routes/index.js";

const host = config.serverHost;
const port = config.serverPort;
const dbHost = config.dbHost;
const dbPort = config.dbPort;
const dbName = config.dbName;

const app = express();
const server = http.Server(app);

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`,  { useNewUrlParser: true, useUnifiedTopology: true });

initUser();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', router);

server.listen(port, host, () => {
    // logger.info(`express server is running on ${host}:${port}`);
    console.log(`express server is running on ${host}:${port}`)
});