import { Router } from "express";
import PassportManager from "../../modules/Passport-Manager";
import pageController from "./page.controller";

const router = Router();

router.post("/", PassportManager.authenticate(), pageController.createPage); // Create\

router.post("/:id/invite", PassportManager.authenticate(), pageController.invitePage); // Delete
router.post("/:id/kick", PassportManager.authenticate(), pageController.kickPage); // Delete

router.delete("/:id", PassportManager.authenticate(), pageController.deletePage); // Delete

export default router;
