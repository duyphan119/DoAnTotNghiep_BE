/**
 * @swagger
 * tags:
 *   name: Hello
 *   description: Greetings API from TheCodeBUzz
 */

/**
 * @swagger
 * path:
 *  /hello:
 *    get:
 *      summary: Get greeting message from TheCodebuzz
 *      responses:
 *        "200":
 *          description: GET reponse from API
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 */
import { Router } from "express";

const router = Router();
router.get("/hello", (req, res) => res.json({ msg: "Hello" }));

export default router;
