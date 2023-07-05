import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";

// Configurations

const __filename = fileURLToPath(import.meta.url);
/* Örneğin, fileURLToPath(import.meta.url) ifadesi file:///path/to/myfile.js şeklinde bir URL döndürdüyse, 
__filename değişkeni /path/to/myfile.js değerini alır. */
const __dirname = path.dirname(__filename);
/* Örneğin, __filename değişkeni /path/to/myfile.js değerini içeriyorsa, __dirname değişkeni /path/to değerini alır. */
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
/*  /assets rotasına yapılan istekler, "public/assets" dizinindeki dosyalara yönlendirilir ve istemciye sunulur. */

//File Storage

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, res, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Routes with files

app.post("/auth/register", upload.single("picture"), register);

// Mongoose Setup

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
