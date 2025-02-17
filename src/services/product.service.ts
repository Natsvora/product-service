import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Product } from "../models/product.model";
import logger from "../utils/logger";
import { PRODUCTS_TABLE, REGION, TAXONOMY_TABLE } from "../types/constant";

const client = new DynamoDBClient({
  region: REGION,
});
const docClient = DynamoDBDocumentClient.from(client);

export class ProductService {
  /**
   * Checks if a category with the given ID exists in the taxonomy table.
   *
   * @param categoryId - The unique identifier of the category to check.
   * @returns A promise that resolves to true if the category exists, false otherwise.
   */
  private async categoryExists(categoryId: string): Promise<boolean> {
    const params = {
      TableName: TAXONOMY_TABLE,
      Key: { TaxonomyId: categoryId },
    };
    const { Item } = await docClient.send(new GetCommand(params));
    return !!Item;
  }

  /**
   * Helper: Checks if all tags in the given array exist in the Taxonomy table.
   * Returns true if all tags exist, or if the array is empty.
   * @param tags The array of tags to validate
   * @returns A promise that resolves to true if all tags exist, false otherwise.
   */
  private async validateTags(tags: string[]): Promise<boolean> {
    if (!tags || tags.length === 0) return true; // No tags to validate
    const tagChecks = await Promise.all(tags.map(async (tagId) => this.categoryExists(tagId)));
    return tagChecks.every((exists) => exists);
  }

  /**
   * Creates a new product. Performs the following validations:
   * - Category exists
   * - Tags exist (if provided)
   * @param product The product to create
   * @throws {Error} If the category or tags are invalid
   */
  async createProduct(product: Product): Promise<void> {
    const categoryValid = await this.categoryExists(product.Category);
    if (!categoryValid) {
      logger.error(`Category ${product.Category} does not exist`);
      throw new Error(`Category ${product.Category} does not exist`);
    }

    if (product.Tags) {
      const tagsValid = await this.validateTags(product.Tags);
      if (!tagsValid) {
        logger.error(`One or more tags are invalid`);
        throw new Error(`One or more tags are invalid`);
      }
    }

    const params = {
      TableName: PRODUCTS_TABLE,
      Item: product,
    };
    await docClient.send(new PutCommand(params));
    logger.info(`Product created: ${JSON.stringify(product)}`);
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param productId - The unique identifier of the product to retrieve.
   * @returns The product if found, otherwise null.
   */
  async getProduct(productId: string): Promise<Product | null> {
    const params = {
      TableName: PRODUCTS_TABLE,
      Key: { ProductId: productId },
    };
    const { Item } = await docClient.send(new GetCommand(params));
    return (Item as Product) || null;
  }

  /**
   * Updates a product with new data.
   *
   * @param productId - The unique identifier of the product to update.
   * @param updates - An object containing the new values for the product.
   * @throws {Error} If the category or tags are invalid
   */
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    if (updates.Category) {
      const categoryValid = await this.categoryExists(updates.Category);
      if (!categoryValid) {
        throw new Error(`Category ${updates.Category} does not exist`);
      }
    }

    if (updates.Tags) {
      const tagsValid = await this.validateTags(updates.Tags);
      if (!tagsValid) {
        throw new Error(`One or more tags are invalid`);
      }
    }

    const updateExpression =
      "set " +
      Object.keys(updates)
        .map((key) => `${key} = :${key}`)
        .join(", ");
    const expressionAttributeValues = Object.keys(updates).reduce((acc, key) => {
      acc[`:${key}`] = updates[key as keyof Product];
      return acc;
    }, {} as any);

    const params = {
      TableName: PRODUCTS_TABLE,
      Key: { ProductId: productId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await docClient.send(new UpdateCommand(params));
    logger.info(`Product updated: ${productId}`);
  }

  /**
   * Deletes a product from the database by its ID.
   *
   * @param productId - The unique identifier of the product to delete.
   * @returns A promise that resolves when the product is successfully deleted.
   */
  async deleteProduct(productId: string): Promise<void> {
    const params = {
      TableName: PRODUCTS_TABLE,
      Key: { ProductId: productId },
    };
    await docClient.send(new DeleteCommand(params));
    logger.info(`Product deleted: ${productId}`);
  }
}
