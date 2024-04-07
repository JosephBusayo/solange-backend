import mongoose from "mongoose";
const MONGO_URI = "mongodb+srv://admin:qwerty1234@cluster0.v6xi590.mongodb.net/hairDb?retryWrites=true&w=majority";


const connectDB = async () => {
  console.log(MONGO_URI)
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Successfully connected to mongoDB`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
