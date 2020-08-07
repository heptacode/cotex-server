import { Router } from "express";
import PassportManager from "../../modules/Passport-Manager";
import pageController from "./page.controller";

const router = Router();

router.post("/", PassportManager.authenticate(), pageController.createPage); // Create\

router.delete("/:id", PassportManager.authenticate(), pageController.deletePage); // Delete

export default router;
