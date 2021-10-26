import express from "express";
import expressValidation from "express-joi-validation";
import { 
    getRestaurants,
    createRestaurant,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant
} from "../../controllers/restaurant.js";
import { 
    getReviews,
    createReview
} from "../../controllers/review.js";

import rolesMiddleware from '../../middlewares/roles.js';
import validateSchema from "./validateSchema.js";

const router = express.Router();
const validator = expressValidation.createValidator({ passError: true });

router.get("/", getRestaurants);
router.post("/", rolesMiddleware(['admin', 'owner']), validator.body(validateSchema.createRestaurant.body), createRestaurant);
router.get("/:id", getRestaurant);
router.put("/:id", rolesMiddleware(['admin', 'owner']), validator.body(validateSchema.updateRestaurant.body), updateRestaurant);
router.delete("/:id", rolesMiddleware(['admin', 'owner']), deleteRestaurant);
router.post("/:id/reviews", rolesMiddleware(['regular']), validator.body(validateSchema.createReview.body), createReview);
router.get("/:id/reviews", getReviews);

export default router;