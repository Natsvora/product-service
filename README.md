# 🌍 AWS Lambda Product Service

## 📚 Overview

This project is a **serverless microservice** that manages product information for an eCommerce platform. It is built using **AWS Lambda, API Gateway, DynamoDB, AWS AppSync, and AWS CodePipeline** for **automated deployment**.

## 🚀 Features

- **CRUD operations for products** (Create, Read, Update, Delete)
- **Pagination support** (limit & offset)
- **GraphQL API with AWS AppSync**
- **AWS CodePipeline for CI/CD**
- **Deployed using AWS CodePipeline**
- **DynamoDB as the database**

---

## 📁 Project Structure

```
├── src/
│   ├── controllers/      # Express Controllers
│   ├── services/         # Business Logic
│   ├── models/           # Database Models
│   ├── utils/            # Utility functions & logger
│   ├── handler.ts        # AWS Lambda entry point
│   ├── app.ts            # Express application setup
│
├── .serverless/          # Serverless deployment artifacts
├── buildspec.yml         # CodeBuild deployment script
├── appspec.yml           # CodeDeploy Lambda deployment spec
├── package.json          # Node.js dependencies
├── serverless.yml        # Serverless Framework configuration
└── README.md             # Project documentation
```

---

## 🔧 Setup & Installation

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js v18+** → [Download](https://nodejs.org/)
- **AWS CLI** → [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- **GitHub Repository** → Clone this repository:
  ```sh
  git clone https://github.com/your-username/aws-lambda-product-service.git
  cd aws-lambda-product-service
  ```

### 2️⃣ Install Dependencies

```sh
npm install
```

---

## 🚀 Deployment

### 1️⃣ Deploy using AWS CodePipeline

- The pipeline is **automatically triggered** on every push to the `main` branch.
- The pipeline consists of the following stages:
  1. **Source** - Fetches code from GitHub.
  2. **Build** - Uses AWS CodeBuild to package the application.
  3. **Deploy** - Uses AWS CodeDeploy to deploy the Lambda function.

### 2️⃣ View Deployed Lambda

```sh
aws lambda list-functions
```

---

## 📈 API Documentation

### REST API Endpoints

| Method   | Endpoint                      | Description            |
| -------- | ----------------------------- | ---------------------- |
| `GET`    | `/api/v1/products?limit=10&offset=0` | Get paginated products |
| `GET`    | `/api/v1/products/{ProductId}`       | Get a single product   |
| `POST`   | `/api/v1/products`                   | Create a new product   |
| `PUT`    | `/api/v1/products/{ProductId}`       | Update product details |
| `DELETE` | `/api/v1/products/{ProductId}`       | Delete a product       |

#### Example: Create Product

```sh
curl -X POST "https://your-api-gateway-url/products" \
     -H "Content-Type: application/json" \
     -d '{
           "Name": "MacBook Air",
           "Description": "Apple M2 Laptop",
           "Price": 1299.99,
           "Category": "C003",
           "Stock": 10
         }'
```

### GraphQL Queries

#### 1️⃣ Get All Products (Paginated)

```graphql
query {
  listProducts(limit: 10, offset: 0) {
    items {
      ProductId
      Name
      Price
      Stock
    }
    totalCount
  }
}
```

#### 2️⃣ Create a Product

```graphql
mutation {
  createProduct(
    Name: "MacBook Pro",
    Description: "Apple MacBook with M2 chip",
    Price: 1299.99,
    Category: "C003",
    Tags: ["Laptop", "Apple"],
    Stock: 10
  ) {
    ProductId
    Name
  }
}
```

---

## ✅ Testing

### 1️⃣ Run Unit Tests

```sh
npm test
```

### 2️⃣ Deploy & Test in AWS Lambda Console

- Go to **AWS Console → Lambda → Test**.
- Use the following test event:

```json
{
  "httpMethod": "GET",
  "path": "/products",
  "queryStringParameters": {
    "limit": "10",
    "offset": "0"
  }
}
```

---

## 🔒 Security & Authentication

- **IAM Roles** ensure **least privilege access**.
- **API Gateway** secures REST endpoints.
- **Cognito (Optional)** for authentication.

---

## 🛠 Troubleshooting

### 1️⃣ Deployment Issues

Check CodePipeline execution:

```sh
aws codepipeline list-pipeline-executions --pipeline-name lambda-deployment-pipeline
```

### 2️⃣ Lambda Function Errors

Check logs:

```sh
aws logs tail /aws/lambda/product-service-stg --follow
```

### 3️⃣ CodePipeline Fails

- Go to **AWS Console → CodePipeline**.
- Click on **Execution Details** for error logs.
