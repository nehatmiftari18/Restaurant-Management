import mongoose from 'mongoose';
import Restaurant from '../models/restaurant.js';
import Review from '../models/review.js';

export const getPendingReviews = async (req, res, next) => {

	try {
			let reviews = await Review.find({ status: "pending" })
												.populate({
														path: 'user',
														select: '-password'
												})
												.populate('restaurant')
												.sort({created: -1});
			
			reviews = reviews.filter(review => review.restaurant && review.restaurant.owner && review.restaurant.owner.equals(req.user._id));
	
			res.json({ reviews });

	} catch (error) {
		next(error);
	}
}

export const getReview = async (req, res, next) => {

	try {
		const id = req.params.id;
		const review = await Review.findById(id)
												.populate({
														path: 'user',
														select: '-password'
												})
												.populate('restaurant');
	
		if (review) {
			res.json({ review });

		} else {
			res.status(400).json({ "message": "Review does not exist." });
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
}

export const getReviews = async (req, res, next) => {
    const restaurantId = req.params.id
    try {
      let options = {
        restaurant: mongoose.Types.ObjectId(restaurantId)
      };
  
      const reviews = await Review.find(options).populate({
        path: 'user',
        select: '-password'
      }).populate('restaurant')
      .sort({created: -1});
  
      res.send({ reviews });
    } catch(err) {
      next(err);
    }
  }

export const updateReview = async (req, res, next) => {

	const id = req.params.id;
  
	try {
    const review = await Review.findById(id);

    if (review) {
			review.rate = req.body.rate;
			review.comment = req.body.comment;
			review.replyComment = req.body.replyComment;

      await review.save();

      const restaurant = await Restaurant.findById(review.restaurant).populate('highestReview lowestReview');

      const reviews = await Review.find({
        restaurant: review.restaurant,
      })

      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum, r) => sum + r.rate, 0);
        restaurant.rateAvg = Math.round(total / reviews.length * 100) / 100;
      
        if (restaurant.highestReview) {
          if (restaurant.highestReview._id.equals(review._id)) {
            let _highestReview = null;
            reviews.forEach(r => {
              if (!_highestReview || r.rate > _highestReview.rate) {
                _highestReview = r;
              }
            })
            restaurant.highestReview = _highestReview;
          } else {
            if (restaurant.highestReview.rate < review.rate) {
              restaurant.highestReview = review;
            }
          }
        } else {
          restaurant.highestReview = review;
        }

        if (restaurant.lowestReview) {
          if (restaurant.lowestReview._id.equals(review._id)) {
            let _lowestReview = null;
            reviews.forEach(r => {
              if (!_lowestReview || r.rate < _lowestReview.rate) {
                _lowestReview = r;
              }
            })
            restaurant.lowestReview = _lowestReview;
          } else {
            if (restaurant.lowestReview.rate > review.rate) {
              restaurant.lowestReview = review;
            }
          }
        } else {
          restaurant.lowestReview = review;
        }
      } else {
        restaurant.rateAvg = 0;
        restaurant.highestReview = null;
        restaurant.lowestReview = null;
      }

      await restaurant.save();
      res.send({ review });
    } else {
      res.status(400).json({ 'message': 'Review does not exist' });
    }

  } catch (err) {
    console.log('error: ', err)
    next(err);
  }
}

export const deleteReview = async (req, res, next) => {

	try {
		const id = req.params.id;

		const review = await Review.findById(id);

		if (!review) {
			return res.status(404).json({ "message": "Review does not exist." });
		}

		await review.remove();

		const restaurant = await Restaurant.findById(review.restaurant)
														.populate('highestReview lowestReview');

		const reviews = await Review.find({ restaurant: review.restaurant });

		if (reviews && reviews.length > 0) {
			const total = reviews.reduce((sum, review) => sum + review.rate, 0);
			restaurant.rateAvg = Math.round(total / reviews.length * 100) / 100;
		
			if (restaurant.highestReview) {
				if (restaurant.highestReview._id.equals(review._id)) {
					let _highestReview = null;
					reviews.forEach(r => {
						if (!_highestReview || r.rate > _highestReview.rate) {
							_highestReview = r;
						}
					});
					restaurant.highestReview = _highestReview;
				}
			}

			if (restaurant.lowestReview) {
				if (restaurant.lowestReview._id.equals(review._id)) {
					let _lowestReview = null;
					reviews.forEach(r => {
						if (!_lowestReview || r.rate < _lowestReview.rate) {
								_lowestReview = r;
						}
					});
					restaurant.lowestReview = _lowestReview;
				}
			}
		} else {
			restaurant.rateAvg = 0;
			restaurant.highestReview = null;
			restaurant.lowestReview = null;
		}

		await restaurant.save();

		res.send({ review });

	} catch (error) {
		next(error);
	}
}

export const replyReview = async(req, res, next) => {

	try {
		const id = req.params.id;
		const review = await Review.findOne({ _id: id }).populate('restaurant');

		if (!review) {
			return res.status(404).json({ "message": "Review does not exist." });
		}

		if (review.restaurant.owner.equals(req.user._id)) {
			review.replyComment = req.body.replyComment;
			review.replyDate = new Date();
			review.status = 'replied';

			await review.save();

			res.send({ review });

		} else {
			res.status(403).json({ "message": "Permission denied"});
		}

	} catch (error) {
		next(error);
	}
}

export const createReview = async (req, res, next) => {
  const id = req.params.id;

  const restaurant = await Restaurant.findById(id).populate('highestReview lowestReview');
  if (!restaurant) {
    res.status(400).send(
      response(false, "Restaurant does not exist")
    );
    return;
  }
  
  try {

		const data = req.body;
    data.user = req.user;
    data.restaurant = mongoose.Types.ObjectId(id);

    const _review = await Review.findOne({
      user: mongoose.Types.ObjectId(req.user._id),
      restaurant: mongoose.Types.ObjectId(id),
    });

    if (_review) {
      res.status(400).json({"message": "Review already exists"});

    } else {
      const review = new Review(data);
      await review.save();

      if (!restaurant.highestReview || restaurant.highestReview.rate < review.rate) {
        restaurant.highestReview = review;
      }
      if (!restaurant.lowestReview || restaurant.lowestReview.rate > review.rate) {
        restaurant.lowestReview = review;
      }
      
      const reviews = await Review.find({
        restaurant: mongoose.Types.ObjectId(id),
      })

      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum, review) => sum + review.rate, 0);
        restaurant.rateAvg = Math.round(total / reviews.length * 100) / 100;
      } else {
        restaurant.rateAvg = 0;
      }

      await restaurant.save();
      
      res.status(201).send({ review });
    }
  } catch (err) {
    next(err);
  }
}