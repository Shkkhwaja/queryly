import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
let listenersAttached = false;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

export const connectToDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (!listenersAttached) {
      // Attach only once to prevent MaxListenersExceededWarning
      mongoose.connection.on('connected', () => {
        console.log('Connected to DB');
      });

      mongoose.connection.on('error', (err) => {
        console.error('DB connection error', err);
      });

      mongoose.connection.setMaxListeners(0);
      listenersAttached = true;
    }

    await mongoose.connect(MONGODB_URI, {
      // Use the modern connection defaults from mongoose 8+
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to DB:', error);
    throw error;
  }
};