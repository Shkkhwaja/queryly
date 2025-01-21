import mongoose from 'mongoose';

export const connectToDB = async () => {
  try {
     mongoose.connect(process.env.MONGODB_URI!)
    const connection = mongoose.connection;

    connection.on('connected', () => {
        console.log('Connected to DB');
    })
    connection.on('error', (err) => {
        console.log('Connected Error',err);
        process.exit();
    })

  } catch (error) {
    console.error('Error connecting to DB: ', error);
  }
};