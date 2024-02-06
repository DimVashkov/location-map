import { Router } from "express";
import Controller from "./controller";
import { param } from "express-validator";
import { validate } from "./validate";

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /overlay-layers:
 *   get:
 *     description: Get Overlay layers
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/overlay-layers", Controller.getOverlayLayers);

/**
 * @openapi
 * /base-layers:
 *   get:
 *     description: Get the several base layers I've defined in the BE
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/base-layers", Controller.getBaseLayers);

/**
 * @openapi
 * /location/:searchTerm:
 *   get:
 *     description: Get the latitude and longitude of a location
 *     parameters:
 *      - in: path
 *        name: searchTerm
 *        description: The search value to find location
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  "/location/:searchTerm",
  validate([param("searchTerm").isString()]),
  Controller.getLocation,
);

export default router;
