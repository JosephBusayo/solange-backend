// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Utils

import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import Product from "./models/productModel.js";
import { upload, handleUpload } from './config/cloudinaryConfig.js';
import formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "./middlewares/authMiddleware.js";
import bodyParser from "body-parser"

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(bodyParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get("/api/v1", (req, res) => {
//   res.json({ message: "Welcome" });
// });

app.post("/api/v1/products", authenticate, authorizeAdmin, upload.single("image"), async (req, res) => {
  try {
      const { name, description, price, category, quantity, brand } = req.body
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);

      const newProduct = new Product({
        name, description, price, category, quantity, brand, image: cldRes.url
      })

      if (newProduct) {
          await newProduct.save();
          res.status(201).json({
              newProduct
          })
      }

  } catch (error) {
      console.log(error);
      res.send({
          message: error.message,
      });
  }
});




app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/orders", orderRoutes);

//******PayPal********
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

console.clear();

app.listen(port, () => console.log(`Server running on port: ${port}`));
