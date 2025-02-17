import express from "express";
import serverless from "serverless-http";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use("/api/v1/products", productRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
