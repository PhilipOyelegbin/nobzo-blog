import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { apiRouter, postRouter, userRouter } from "./src/routes/index.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:3000, http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors(corsOptions));
app.use(helmet());
app.use("/api", apiRouter);

apiRouter.use("", userRouter);
apiRouter.use("/posts", postRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the Nobzo blog backend server!" });
});

apiRouter.get("/health", (req, res) => {
  res.status(200).json({ message: "Nobzo blog backend is healthy" });
});

app.all("{*path}", (req, res) => {
  res.status(404).json({
    status: "Not Found",
    message: "The requested resource was not found.",
  });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
