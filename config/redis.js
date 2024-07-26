const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = redis.createClient(process.env.REDIS_URL);

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = redisClient;
