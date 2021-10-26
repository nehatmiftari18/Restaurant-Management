import mongoose from 'mongoose';

import User from '../models/user.js';
import Restaurant from '../models/restaurant.js';
import Review from '../models/review.js';


export const getRestaurants = async (req, res, next) => {
	try {
		let options = {};

		options['$and'] = [
			{ rateAvg: { '$gte': req.query.min || 0 } },
			{ rateAvg: { '$lte': req.query.max || 5 } },
		];

		if (req.user.role === 'owner') {
			options.owner = req.user._id;
		}

		const restaurants = await Restaurant.find(options).populate({
			path: 'owner',
			select: '-password'
		});

		res.json({ restaurants });

	} catch(error) {
		next(error);
	}
}

export const createRestaurant = async (req, res, next) => {
	console.log(req.user);
	try {
		let { name, description, owner } = req.body;
		if (req.user.role === "owner") {
			owner = req.user._id;

		} else if (owner) {
			const user = await User.findById(owner);
			if (user && user.role === "owner") {
				owner = mongoose.Types.ObjectId(owner);
			} else {
				return res.status(400).json({ "message": "Owner user does not exist." });
			}
		}

		const restaurant = new Restaurant({ name, description, owner });
		await restaurant.save();

		res.status(201).json({ restaurant });

	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			return res.status(400).json({ "message": "Name is already used" });
		}

		next(error);
	}
}

export const getRestaurant = async (req, res, next) => {
	try {
		const id = req.params.id;
		const restaurant = await Restaurant.findById(id).populate({
			path: 'owner',
			select: '-password'
		})
		.populate({
			path: 'highestReview',
			populate: { path: 'user' }
		})
		.populate({
			path: 'lowestReview',
			populate: { path: 'user' }
		});

		if (restaurant) {
			res.json({ restaurant });
		} else {
			res.status(404).json({ "message": "Restaurant doesn't exist." });
		}
	} catch(error) {
		next(error);
	}
}

export const updateRestaurant = async (req, res, next) => {  
	try {
		const id = req.params.id;
		let { name, owner } = req.body;

		if (req.user.role === 'admin') {
			const user = await User.findById(owner);
	
			if (user && user.role === 'owner') {
				owner = mongoose.Types.ObjectId(owner);

			} else {
				return res.status(400).json({ "message": "Owner user does not exist." });
			}
		}

		const restaurant = await Restaurant.findById(id);

		if (restaurant) {
			if (req.user.role === 'admin' || restaurant.owner.equals(req.user._id)) {
				restaurant.name = name;
				restaurant.owner = owner;
				await restaurant.save();

				res.json({ restaurant });

			} else {
				res.status(403).json({ "message": "Permission denied" });
			}

		} else {
			return res.status(404).json({ "message": "Restaurant does not exist." });
		}

	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			res.status(400).json({ "message": "Name is already used" });
		}
		next(error);
	}
}

export const deleteRestaurant = async (req, res, next) => {
	try {
		const id = req.params.id;

		const restaurant = await Restaurant.findById(id);
		if (restaurant) {
			if (req.user.role === 'admin' || restaurant.owner.equals(req.user._id)) {
				await Review.remove({ restaurant: restaurant._id })
				await restaurant.remove();

				res.json({ restaurant });
			} else {
				res.status(403).json({ "message": "Permission denied" });
			}
		} else {
			res.status(400).json({ "message": "Can't find the restaurant" });
		}
    
  } catch(error) {
    next(error);
  }
}