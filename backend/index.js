// imports for project
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Redis = require("redis");
const { nanoid } = require("nanoid");

// redis setup
const redisClient = Redis.createClient();
(async () => {
  redisClient.on("error", (error) => console.error(`Redis Error: ${error}`));
  redisClient.on("connect", () => console.log("Redis connected"));
  await redisClient.connect();
})();

// setting up cors so backend and frontend can communicate without any issues
const corsOptions = {
  origin: "*",
};

// setting up express app
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// base url for testing backend endpoint
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello",
  });
});

// ToDo: complete below implementation
// this is the endpoint that will be used to shorten a URL
app.post('/shorten-url', async (req, res) => {})


// starting a http server on a port
const PORT = process.env.PORT || 4000;

const http = require("http").Server(app);

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});