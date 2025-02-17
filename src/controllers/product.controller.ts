import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { Product } from "../models/product.model";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

const productService = new ProductService();

/**
 * Creates a new product.
 *
 * @param req - The request object containing the new product data in the request body.
 * @param res - The response object used to send the success or error response.
 * @returns A JSON response indicating the success or failure of the create operation.
 * @throws {Error} If the product could not be created.
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { Name, Description, Price, Category, Stock } = req.body;

    if (!Name || !Price || !Category || Stock === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product: Product = {
      ProductId: uuidv4(),
      Name,
      Description,
      Price,
      Category,
      Stock,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    await productService.createProduct(product);
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

/**
 * Retrieves a paginated list of products.
 *
 * @param req - The request object containing optional query parameters for pagination:
 *              `limit` to specify the maximum number of products to retrieve,
 *              and `offset` to determine the starting point for the result set.
 * @param res - The response object used to send the list of products or an error message.
 * @returns A JSON response with the list of products and their total count,
 *          or a 500 error message if the retrieval fails.
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    const parsedLimit = parseInt(limit as string, 10) || 10;
    const parsedOffset = parseInt(offset as string, 10) || 0;

    const products = await productService.listProducts(parsedLimit, parsedOffset);
    res.status(200).json(products);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/**
 * Retrieves a product by its ID.
 *
 * @param req - The request object, which must contain the ID of the product
 * to retrieve in the `productId` parameter.
 * @param res - The response object.
 * @returns A JSON response with the product if it exists, or a 404 error if
 * it does not exist, or a 500 error if there was a problem with the request.
 */
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProduct(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve product" });
  }
};

/**
 * Updates a product with new data.
 *
 * @param req - The request object containing the `productId` in the URL parameters
 *              and the product `updates` in the request body.
 * @param res - The response object used to send the success or error response.
 * @returns A JSON response indicating the success or failure of the update operation.
 * @throws {Error} If the product update fails.
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    await productService.updateProduct(productId, updates);
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * Deletes a product by its ID.
 *
 * @param req The request object, which must contain the ID of the product
 * to delete in the `productId` parameter.
 * @param res The response object.
 * @returns A JSON response with a message indicating success or failure.
 * @throws {Error} If the product could not be deleted.
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    await productService.deleteProduct(productId);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
