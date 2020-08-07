import { Router } from "express";
import PassportManager from "../../modules/Passport-Manager";
import pageController from "./page.controller";

const router = Router();

router.post("/", PassportManager.authenticate(), pageController.createPage);

router.post("/my-page", PassportManager.authenticate(), pageController.myPage);
router.post("/:id/invite", PassportManager.authenticate(), pageController.invitePage);
router.post("/:id/kick", PassportManager.authenticate(), pageController.kickPage);

router.delete("/:id", PassportManager.authenticate(), pageController.deletePage);l

export default router;
