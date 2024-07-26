const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { dbConnection } = require('./config/dbConfig');
const redisClient = require('./config/redis');
const authRoute = require('./routes/authRoute');
const taskRoute = require('./routes/taskRoute');


const app = express();
app.use(bodyParser.json());

app.use('/api', authRoute);
app.use('/api/task', taskRoute);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

const PORT = process.env.PORT || 3000;

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
