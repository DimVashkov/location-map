import express from "express";
import cors from "cors";
import swaggerUiExpress from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerDefinition } from "./swaggerDefinition";
import router from "./routes";

const swaggerSpecs = swaggerJsDoc({
  swaggerDefinition,
  apis: ["./routes.ts"],
});
const app = express();
const port = 3000;

app.use(cors());
app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpecs),
);
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
