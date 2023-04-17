import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import userRoute from "./routes/user.route";
import walletRoute from "./routes/wallet.route";
import swaggerDocs from "./config/swagger";

const http = require('http');


// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests


createConnection().then(async connection => {

  console.log("Express application is up and running on port 3000");
}).catch(error => console.log("TypeORM connection error: ", error));


const hostname = 'localhost'
const httpPort = 3000;


const app = express();
const httpServer = http.createServer(app);


var cors = require('cors');

var allowedOrigins = [
  'http://localhost:4200'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },

  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  credentials: true,

}));

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// routes
app.use(userRoute);
app.use(walletRoute);
// app.use(getQuotesRoute)
// app.use(emailRoute)


httpServer.listen(httpPort, hostname);
// swaggerDocs(app, httpPort);


