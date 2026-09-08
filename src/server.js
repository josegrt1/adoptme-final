import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB conectada correctamente');
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch((error) => {
    console.error('Error al conectar MongoDB:', error.message);
  });