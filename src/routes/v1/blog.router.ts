import axios from "axios";
import * as cheerio from "cheerio";
import { Request, Response, Router } from "express";
import blogController from "../../controllers/blog.controller";
import { requireIsAdmin } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Blog:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        title:
 *          type: string
 *          example: Outgoing president of Micronesia accuses China of bribery, threats and interference
 *        heading:
 *          type: string
 *          example: In his letter, Panuelo openly canvassed the country switching its diplomatic recognition from Beijing to Taipei
 *        slug:
 *          type: string
 *          example: outgoing-president-of-micronesia-accuses-china-of-bribery-threats-and-interference
 *        content:
 *          type: string
 *          example: <p>China is engaged in “political warfare” in the Pacific, the outgoing president of the Federated States of Micronesia has alleged in an excoriating letter, accusing Beijing officials of bribing elected officials in Micronesia, and even “direct threats against my personal safety”.</p>
 *        thumbnail:
 *          type: string
 *          example: https://i.guim.co.uk/img/media/f60b4e951b0272578a08df263d6927054422d94a/212_211_3585_2151/master/3585.jpg?width=620&quality=45&dpr=2&s=none
 *        blogCategoryId:
 *          type: integer
 *        userId:
 *          type: integer
 *        createAt:
 *          type: date
 *          example: 2023-01-01T09:01:02Z
 *        updatedAt:
 *          type: date
 *          example: 2023-01-01T09:01:02Z
 *        deletedAt:
 *          type: date
 *          example: null
 */

/**
 * @swagger
 * paths:
 *  /blog:
 *    get:
 *      summary: Get all blogs
 *      responses:
 *        200:
 *          description: GET reponse from API
 *          content:
 *            application/json:
 *              schema:
 *                type: string
 *      parameters:
 *        sortBy:
 *          in: query
 *          description: sort by field name
 *          required: false
 */

router.get("/seed", blogController.seed);
router.get("/search", blogController.search);
router.get("/:id", blogController.getById);
router.get("/", blogController.getAll);
router.post("/", requireIsAdmin, blogController.createOne);
router.patch("/:id", requireIsAdmin, blogController.updateOne);
router.delete("/many", requireIsAdmin, blogController.softDeleteMany);
router.delete("/:id", requireIsAdmin, blogController.softDeleteOne);
router.delete("/restore/many", requireIsAdmin, blogController.restoreMany);
router.delete("/restore/:id", requireIsAdmin, blogController.restoreOne);
router.delete("/force/many", requireIsAdmin, blogController.deleteMany);
router.delete("/force/:id", requireIsAdmin, blogController.deleteOne);

router.get("/123/test", async (req: Request, res: Response) => {
  const { data: html } = await axios.get("https://yody.vn/blog-thoi-trang-nu");
  const $ = cheerio.load(html);
  $(".list-blogs .row").each(function () {
    const src = $(this).find(".item-blog .thumb img").attr("src");
    const title = $(this).find(".item-blog .content h3").text();
    const heading = $(this).find(".item-blog .content h3 + p").text();
    console.log(src);
  });

  res.send("OK");
});

export default router;
