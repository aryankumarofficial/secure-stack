import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Secure Stack API",
      version: "1.0.0",
      description: "Task Management and Authentication API",
      contact: {
        name: "Aryan Kumar",
        email: "aryan@aryankumarofficial.dev",
        url: "https://aryankumarofficial.dev",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "{protocol}://localhost:{port}",
        description: "Local development server",
        variables: {
          protocol: {
            default: "http",
            enum: ["http", "https"],
          },
          port: {
            default: "5000",
            enum: ["5000", "8080"],
          },
        },
      },
      {
        url: "https://secure-stack-backend.aryankumarofficial.dev",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Registration, login, logout, email verification",
      },
      { name: "Users", description: "User profile and account management" },
      { name: "Tasks", description: "Task CRUD operations" },
      { name: "Admin", description: "Admin-only management endpoints" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
          },
          required: ["success", "message"],
        },
      },
      responses: {
        Unauthorized: {
          description: "Missing or invalid access token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Forbidden: {
          description: "Insufficient permissions (non-admin)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ValidationError: {
          description: "Request body failed Zod validation",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/validators/*.ts",
    "./src/types/*.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
