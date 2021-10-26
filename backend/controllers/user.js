import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/user.js";
import Restaurant from "../models/restaurant.js";
import Review from "../models/review.js";

export const login = async (req, res, next) => {

	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(400).json({ "message": "Invalid email or password" });
		}

		user.comparePassword(password, (error, match) => {
			if (error) {
				return next (err);
			}

			if (match) {
				const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: 86400 });
				res.json({ token: token, user: user.toObject() });

			} else {
				res.status(400).json({ "message": "Invalid email or password" });
			}
		});
			
	} catch (error) {
		next(error)
	}
}

export const register = async (req, res, next) => {

	try {
		const user = new User(req.body);
		await user.save();
		
		const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: 86400 });
		res.status(201).json({ token: token, user: user.toObject() });

	} catch (error) {
		console.log(error);

		if (error.name === "MongoError" && error.code === 11000) {
			return res.status(400).send({ "message": "Email is already in use." });
		}

		next(error);
	}
}

export const updateProfile = async (req, res, next) => {
  
  try {
    	req.user.email = req.body.email;
		req.user.fullname = req.body.fullname;

		await req.user.save();

		res.json({ user: req.user.toObject() });

  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ "message": "Email is already used by other user"});
    }
    next(err);
  }

}

export const changePassword = async (req, res, next) => {

	try {
		const { oldPassword, newPassword } = req.body;
    req.user.comparePassword(oldPassword, async (err, match) => {
      if (err) next(err);

      if (match) {
        req.user.password = newPassword;

        await req.user.save();

        res.json({ "message": "Successfully changed password" });

      } else {
        res.status(400).json({ "message": "Password is incorrect" });
      }
    });

  } catch (err) {
    next(err);
  }
}

export const getUsers = async (req, res, next) => {

	try {
		const role = req.query.role;

		let condition = { $in: ["owner", "regular"] };

		if (role) {
				condition = role;    
		}
		const users = await User.find({ role: condition });
		res.json({ users });

	} catch (error) {
		console.log(error)
		next(error);
	}
}

export const createUser = async (req, res, next) => {

	try {

		const user = new User(req.body);
		await user.save();

		res.status(201).json({ user: user.toObject() });

	} catch (error) {
			
		if (error.name === "MongoError" && error.code === 11000) {
			return res.status(400).json({ "message": "Email is already in use." });
		}

		next(error);
	}
}

export const getUser = async (req, res, next) => {

	try {
		const id = req.params.id;

		const user = await User.findById(id);

		if (user) {
			res.json({ user: user.toObject() });

		} else {
			res.status(404).json({ "message": "User does not exist." });
		}

	} catch (error) {
		next(error);
	}
}

export const updateUser = async (req, res, next) => {

	try {
		const id = req.params.id;
		const { email, fullname } = req.body;
		const user = await User.findById(id);

		if (user) {
			if (user.role === "admin") {
					return res.status(403).json({ "message": "Permission denied." });
			}

			user.email = email;
			user.fullname = fullname;
			await user.save();
			res.json({ user });

		} else {
			res.status(404).json({ "message": "User does not exist." });
		}

	} catch (error) {
		if (error.name === "MongoError" && error.code === 11000) {
			return res.status(400).json({ "message": "Email is already in use." });
		}

		next(error);
	}
}

export const deleteUser = async(req, res, next) => {

	try {
		const id = req.params.id;

		const user = await User.findById(id);

		if (user) {
			if (user.role === "admin") {
				return res.status(403).json({ "message": "Permission denied." });

			} else if (user.role === "owner") {
				const restaurants = await Restaurant.find({owner: id});
        if (restaurants && restaurants.length > 0) {
          for (let i = 0; i < restaurants.length; i ++) {
            await Review.remove({ restaurant: restaurants[i]._id });
            await restaurants[i].remove();
          }
        }

			} else if (user.role === "regular") {
				const reviews = await Review.find({user: id});
        let relevantRestaurants = [];
        if (reviews && reviews.length > 0) {
          for (let i = 0; i < reviews.length; i ++) {
            if (relevantRestaurants.indexOf(reviews[i].restaurant)) {
              relevantRestaurants.push(reviews[i].restaurant);
            }
            await reviews[i].remove();
          }
        }
        for (let j = 0; j < relevantRestaurants.length; j ++) {
          await calculateAggregate(relevantRestaurants[j]);
        }
			}

			user.remove();
			res.json({ user: user.toObject() });

		} else {
			res.status(404).json({ "message": "User does not exist." });
		}

	} catch (error) {
		next(error);
	}
}

const calculateAggregate = async (id) => {
  try {
    const restaurant = await Restaurant.findById(id);
    if (restaurant) {
      const reviews = await Review.find({restaurant: id});
      let highestReview = null, lowestReview = null, average = 0;
      if (reviews && reviews.length > 0) {
        for (let i = 0; i < reviews.length; i ++) {
          if (!highestReview || highestReview.rate < reviews[i].rate) {
            highestReview = reviews[i];
          }
          if (!lowestReview || lowestReview.rate > reviews[i].rate) {
            lowestReview = reviews[i];
          }
          average += reviews[i].rate;
        }
        average = Math.round(average / reviews.length * 100) / 100;
      }
      restaurant.highestReview = highestReview;
      restaurant.lowestReview = lowestReview;
      restaurant.rateAvg = average;

      restaurant.save();
    }
  } catch (err) {
    console.log('error: ', err);
  }
}
