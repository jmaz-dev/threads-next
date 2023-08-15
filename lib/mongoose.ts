import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
 mongoose.set("strictQuery", true);

 if (!process.env.MONGODB_URL) return console.log("Connection string não encontrada");
 if (isConnected) return console.log("DB Conectado");

 try {
  await mongoose.connect(process.env.MONGODB_URL);

  isConnected = true;
  console.log("Connectado ao MongoDB");
 } catch (error) {
  console.log(error);
 }
};
