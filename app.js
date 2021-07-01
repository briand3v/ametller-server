const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRouter = require('./src/routes/authentication.router');
const errorHandlerMiddleware = require('./src/middleware/errorHandler.middleware');
const passportMiddleware = require('./src/middleware/passport.middleware');
const authenticateMiddleware = require('./src/middleware/authentication.middleware');

const port = 8080;
const app = express();
const server = http.createServer(app);
dotenv.config();

// connect to database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(client => {
    console.log('Database connection successfully');
  })
  .catch(err => console.error(err))

// passport init
passportMiddleware.init();
authenticateMiddleware.init();

passportMiddleware.serializeUser();
passportMiddleware.deserializeUser();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandlerMiddleware);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  process.exit(1);
});
