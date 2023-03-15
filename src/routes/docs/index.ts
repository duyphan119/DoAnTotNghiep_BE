import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import configSwagger from "../../config/configSwagger";

const specs = swaggerJSDoc(configSwagger);

const router = Router();
router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

export default router;
