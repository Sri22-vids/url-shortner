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
app.post('/shorten-url', async (req, res) => {
  const { originalUrl } = req.body;
  if(!originalUrl || !originalUrl.trim()){
    res.status(400).send("Original URL is required")
  }
  try{
    const shortId = nanoid(5)
    const isShortIdUnique = await redisClient.get(`${shortId}`)
    if(isShortIdUnique){
      app.post('/shorten-url', req, res)
    }
    const urlData = {
      id: shortId,
      originalUrl: originalUrl,
      shortUrl: `http://localhost:4000/${shortId}`
    }
    await redisClient.setEx(`${shortId}`, 3600, JSON.stringify(urlData))
    res.status(200).send(urlData)
  }
  catch(e){
    console.log(e)
    res.status(500).send("Internal Server erro")
  }
})

// ToDo: Complete Below Implementation
// this will be used to redirect users based on the short url provided
app.get("/:id", async(req, res) => {
  const { id } = req.params
  try{
    const cachedData = await redisClient.get(`${id}`)
    if(cachedData){
      const parsedData = JSON.parse(cachedData);
      res.redirect(parsedData.originalUrl)
    }
    else{
      res.status(404).send("URL not found")
    }
  }
  catch(e){
    console.log(e)
    res.status(500).send("Internal Server erro")
  }
})


// starting a http server on a port
const PORT = process.env.PORT || 4000;

const http = require("http").Server(app);

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});