const monqoose = require('mongoose');
const host = process.env.DB_HOST || "127.0.0.1:27017";
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');

// Connect to MongoDB
const connect = () => {
   setTimeout(() => monqoose.connect(dbURI, {
   }), 1000);
};

// Monitor connection events
monqoose.connection.on('connected', () => {
   console.log(`Mongoose connected to ${dbURI}`);
});

monqoose.connection.on('error', err => {
   console.error(`Mongoose connection error: ${err}`);
});

monqoose.connection.on('disconnected', () => {
   console.error(`Mongoose disconnected from ${dbURI}`);
});

// Windows specific listener
if (process.platform === 'win32') {
   const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout
   });
   rl.on('SIGINT', () => {
      process.emit('SIGINT');
   });
}

// Configure for Graceful shutdown
const gracefulShutdown = (msg) => {
   monqoose.connection.close(() => {
      console.log(`Mongoose disconnected through ${msg}`);
   });
}

// Shutdown invoked by nodemon signal
process.once('SIGUSR2', () => {
   gracefulShutdown('nodemon restart');
   process.kill(process.pid, 'SIGUSR2');
});

// Shutdown invoked by app termination
process.on('SIGINT', () => {
   gracefulShutdown('app termination');
   process.exit(0);
});

// Shutdown invoked by container termination
process.on('SIGTERM', () => {
   gracefulShutdown('container termination');
   process.exit(0);
});

// Make initial connection to DB
connect();

// Import Mongoose schema
require('./travlr');
module.exports = monqoose;
