import express from "express";
import expressValidation from "express-joi-validation";
import { 
    getPendingReviews,
    getReview,
    updateReview,
    deleteReview,
    replyReview
} from "../../controllers/review.js";
import validateSchema from "./validateSchema.js";
import rolesMiddleware from '../../middlewares/roles.js';

const router = express.Router();
const validator = expressValidation.createValidator({ passError: true });

router.get("/pending", rolesMiddleware(['owner']), getPendingReviews);
router.get("/:id", getReview);
router.put("/:id", rolesMiddleware(['admin']), validator.body(validateSchema.updateReview.body), updateReview);
router.delete("/:id", rolesMiddleware(['admin']), deleteReview);
router.post("/:id/reply", rolesMiddleware(['owner']), validator.body(validateSchema.replyReview.body), replyReview);

export default router;