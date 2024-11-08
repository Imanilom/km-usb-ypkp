import express from 'express';
import { auth } from '../middleware/auth.js';
import  { addNews, updateNews, deleteNews, getNewsByOrganization } from "../controllers/news.controller.js";

const router = express.Router();

router.post("/", auth(["admin", "superadmin"]), addNews);
router.put("/:id", auth(["admin", "superadmin"]), updateNews);
router.delete("/:id", auth(["admin", "superadmin"]), deleteNews);
router.get("/:organizationId", getNewsByOrganization);

export default router;
