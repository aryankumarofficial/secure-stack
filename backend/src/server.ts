import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./middlewares/logger.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import rootRouter from "./routes/index.js";
import swaggerDocument from "./swagger.json";

const app = express();
const port = Number(process.env.PORT) || 5000;
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

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at ${port}`);
});
