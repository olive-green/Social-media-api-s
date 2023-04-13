import express from "express";

import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { ConnectDB } from "./config/Database.js";
import validate from "./middleware/AuthMiddleware.js";
import authRouter from "./router/AuthRoute.js";
import postRouter from "./router/PostRoutes.js";
import userRouter from "./router/UserRoutes.js";

const app = express();
dotenv.config();
ConnectDB();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/authenticate", authRouter);
app.use("/api", validate, postRouter);
app.use("/api", validate, userRouter);

app.listen(process.env.PORT, () =>
  console.log(`Developement Server is running on port ${process.env.PORT}...`)
);

export default app;
