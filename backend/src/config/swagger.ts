import swaggerJSDoc from "swagger-jsdoc";

export const options: swaggerJSDoc.Options = {
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
        url: "{protocol}://localhost:{port}/api",
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
        url: "https://secure-stack-backend.aryankumarofficial.dev/api",
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
  apis:
    process.env.NODE_ENV === "production"
      ? ["./dist/**/*.js"]
      : ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
