import express from "express";
import passport from 'passport';
import passportConfig from '../config/passport.js';
import user from "./user/index.js";
import restaurant from "./restaurant/index.js";
import review from "./review/index.js";

const router = express.Router();

passportConfig(passport);
router.use(passport.initialize());

router.use('/users', user);

const authorization = passport.authenticate('jwt', { session: false });
router.use('/restaurants', authorization, restaurant);
router.use('/reviews', authorization, review);

router.use((error, req, res, next) => {

	if (error.error && error.error.details.length > 0) {

		const message = error.error.details[0].message
		return res.status(400).json({ 
			message: message 
		});

	} else {

		if (error.code) {
			return res.status(error.code).json({ message: error.message })
		} else {
			return res.status(500).json({ message: error.message || "Server Internal Error" });
		}
	}
});

export default router;