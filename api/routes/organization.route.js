import express from "express";
import {
    addOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganization,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminUsers
} from "../controllers/organization.controller.js";
import auth from "../middleware/auth.js"; // Middleware untuk autentikasi dan otorisasi

const router = express.Router();

// Middleware auth(["superadmin"]) hanya memperbolehkan akses untuk superadmin
router.get("/", auth(["superadmin"]), getOrganization);
router.post("/", auth(["superadmin"]), addOrganization);
router.put("/:id", auth(["superadmin"]), updateOrganization);
router.delete("/:id", auth(["superadmin"]), deleteOrganization);

router.post("/admin", auth(["superadmin"]), addAdmin);
router.get("/admin", auth(["superadmin"]), getAdminUsers);
router.put("/admin/:id", auth(["superadmin"]), updateAdmin);
router.delete("/admin/:id", auth(["superadmin"]), deleteAdmin);

export default router;
