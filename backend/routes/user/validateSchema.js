import Joi from 'joi';


const login = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(20).required()
	})
}

const register = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(20).required(),
		fullname: Joi.string().max(255).required(),
		role: Joi.string().valid("regular", "owner").required()
	})
}

const getUsers = {    
	query: Joi.object({
		role: Joi.string().valid("regular", "owner")
	})
}

const createUser = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(20).required(),
		fullname: Joi.string().max(255).required(),
		role: Joi.string().valid("regular", "owner").required()
	})
}

const getUser = {
	params: Joi.object({
		id: Joi.string().required()
	})
}

const updateUser = {
	body: Joi.object({
		email: Joi.string().email().required(),
		fullname: Joi.string().max(255).required()
	})
}

const deleteUser = {
	params: Joi.object({
		id: Joi.string().required()
	})
}

const updateProfile = {
	body: Joi.object({
		email: Joi.string().email(),
		fullname : Joi.string().max(255),
	})
}

const changePassword = {
	body: Joi.object({
		oldPassword: Joi.string().max(255).required(),
    newPassword: Joi.string().max(255).min(8).required()
	})
}

export default {
	login,
	register,
	changePassword,
	getUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	updateProfile
};