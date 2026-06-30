import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect("mongodb+srv://adarshgiri756_db_user:U2oAOqWHtivSOHJK@cluster0.nfkji0k.mongodb.net/?appName=Cluster0/MERN");
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
