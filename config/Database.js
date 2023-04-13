import { connect } from "mongoose";

export const ConnectDB = () => {
  try{

    connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
      );
      console.log("Database Connected");
    }
    catch(error){
      console.log(error);
    }
};
