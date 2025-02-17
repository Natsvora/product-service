import express from "express";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/product.controller";

const router = express.Router();

router.post("/", createProduct);
router.get("/:productId", getProduct);
router.get("/", getProducts);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
