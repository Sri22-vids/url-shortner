const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Redis = require("redis");
const { nanoid } = require("nanoid");

const redisClient = Redis.createClient();

(async () => {
  redisClient.on("error", (error) => console.error(`Redis Error: ${error}`));
  redisClient.on("connect", () => console.log("Redis connected"));
  await redisClient.connect();
})();

const corsOptions = {
  origin: "*",
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello",
  });
});

app.post('/shorten-url', async (req, res) => {
  const { longUrl } = req.body;

  // Basic validation (optional, consider more robust validation)
  if (!longUrl || !longUrl.trim()) {
    return res.status(400).json({ error: 'Please provide a valid URL to shorten.' });
  }

  try {
    // Generate a unique short URL
    const shortUrl = nanoid(5);

    // Check if the short URL already exists in Redis (optional)
    const existingUrl = await redisClient.get(`${shortUrl}`);
    if (existingUrl) {
      // If it exists, generate a new one (consider a retry limit)
      console.warn('Short URL already exists, generating a new one.');
      return app.post('/shorten-url', req, res); // Recursive call to generate new shortUrl
    }

    // Create the shortened URL data
    const urlData = {
      id: shortUrl,
      originalUrl: longUrl,
      shortUrl: `http://localhost:4000/${shortUrl}`,
    };

    // Set the shortened URL data in Redis with an expiry time (optional)
    await redisClient.setEx(`${shortUrl}`, 60 * 60, JSON.stringify(urlData)); // Expires in 1 hour

    console.log(`Shortened URL: ${urlData.shortUrl}`);
    res.json(urlData);
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cachedData = await redisClient.get(`${id}`);
    if (cachedData) {
      console.log('from cache');
      const parsedData = JSON.parse(cachedData); // Parse the cached data
      console.log(parsedData)
      res.redirect(parsedData.originalUrl); 
    } else {
      res.status(404).send("URL not found"); 
    }
  } catch (e) {
    console.error("Error fetching URL:", e); 
    res.status(500).send("Internal server error"); 
  }
});

const PORT = process.env.PORT || 4000;

const http = require("http").Server(app);

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
