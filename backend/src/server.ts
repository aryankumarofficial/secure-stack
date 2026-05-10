import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./middlewares/logger";
import rootRouter from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
const app = express();
const port = Number(process.env.PORT);
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(logger);

app.get("/", (_, res) => {
  return res.json({
    status: "OK",
    message: "Server Running Successfully",
  });
});

app.use("/api", rootRouter);

app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
