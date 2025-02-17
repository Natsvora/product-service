import express from "express";
import { createProduct, getProduct, updateProduct, deleteProduct } from "../controllers/product.controller";

const router = express.Router();

router.post("/", createProduct);
router.get("/:productId", getProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
