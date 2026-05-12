import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import { options } from "../config/swagger";

const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
