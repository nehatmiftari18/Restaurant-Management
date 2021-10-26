import Joi from 'joi';

const createRestaurant = {
	body: Joi.object({
		name: Joi.string().required(),
		description: Joi.string().allow(''),
		owner: Joi.string().allow('')
	})
}

const updateRestaurant = {
	body: Joi.object({
		name: Joi.string().required(),
		description: Joi.string().allow(''),
		owner: Joi.string().allow('')
	})
}

const createReview = {
	body: Joi.object({
		rate: Joi.number().greater(0).max(5),
    visited: Joi.date(),
    comment: Joi.string().required()
	})
}

export default {
	createRestaurant,
	updateRestaurant,
	createReview
};