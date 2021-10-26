import Joi from 'joi';

const replyReview = {
	body: Joi.object({
		replyComment: Joi.string().required()
	})
}

const updateReview = {
	body: Joi.object({
		rate: Joi.number().greater(0).max(5),
    comment: Joi.string().required(),
    replyComment: Joi.string().allow('')
	})
}

export default {
	replyReview,
	updateReview
};