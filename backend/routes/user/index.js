import express from "express";
import expressValidation from "express-joi-validation";
import passport from 'passport';
import passportConfig from '../../config/passport.js';
import {
    login, register, updateProfile, changePassword, getUsers, createUser, getUser, updateUser, deleteUser
} from "../../controllers/user.js";
import validateSchema from "./validateSchema.js";
import rolesMiddleware from '../../middlewares/roles.js';

const router = express.Router();

passportConfig(passport);
router.use(passport.initialize());

const authorization = passport.authenticate('jwt', { session: false });

const validator = expressValidation.createValidator({ passError: true });

router.post("/login", validator.body(validateSchema.login.body), login);
router.post("/register", validator.body(validateSchema.register.body), register);
router.put('/profile', authorization, validator.body(validateSchema.updateProfile.body), updateProfile);
router.put('/password', authorization, validator.body(validateSchema.changePassword.body), changePassword);

router.get("/", authorization, rolesMiddleware('admin'), validator.query(validateSchema.getUsers.query), getUsers);
router.post("/", authorization, rolesMiddleware('admin'), validator.body(validateSchema.createUser.body), createUser);
router.get("/:id", authorization, rolesMiddleware('admin'), validator.params(validateSchema.getUser.params), getUser);
router.put("/:id", authorization, rolesMiddleware('admin'), validator.body(validateSchema.updateUser.body), updateUser);
router.delete("/:id", authorization, rolesMiddleware('admin'), validator.params(validateSchema.deleteUser.params), deleteUser);

export default router;