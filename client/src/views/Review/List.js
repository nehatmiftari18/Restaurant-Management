import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Button, Card, Modal, Form
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import moment from "moment";
import cogoToast from "cogo-toast";

import { getPendingReviews, replyReview } from "apis";

function PendingReviews() {
  
  const [pendingReviews, setPendingReviews] = React.useState([]);
	const [selectedReview, setSelectedReview] = React.useState(null);
	const [replyComment, setReplyComment] = React.useState("");
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [submitting, setSubmitting] = React.useState(false);
	
	const token = useSelector(state => state.token);

	useEffect(() => {
		fetchReviews();
  }, []);

	const fetchReviews = async() => {
		
		try {
			const result = await getPendingReviews(token);
			setPendingReviews(result.reviews);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	const reply = (review) => {
		setSelectedReview(review);
		setReplyComment("");
    setIsModalOpen(true);
  }

	const closeReplyModal = (event) => {
		if (event) event.preventDefault();
		setIsModalOpen(false);
	}

	const submitReply = async (event) => {
		event.preventDefault();

		try {
			setSubmitting(true);
			const result = await replyReview(selectedReview._id, replyComment, token);
			cogoToast.success("Succeed to reply comment");

			const _pendingReviews = [];
			pendingReviews.forEach(review => {
				if (review._id !== selectedReview._id) {
					_pendingReviews.push(review);
				}
			});
			setPendingReviews(_pendingReviews);
			closeReplyModal();

		} catch(error) {
			console.log(error);
			cogoToast.error(error.data.message);
		} finally {
			setSubmitting(false);
		}
	}

  return (
		<div className="animated fadeIn h-100 w-100">
			{pendingReviews.length > 0
				? pendingReviews.map((review, i) => (
				<Card key={`review-${i}`}>
					<Card.Body>
						<div className="justify-content-between align-items-center d-flex">
							<div><h4>{review.restaurant.name}</h4></div>
							<div>{moment(review.created).format('MM-DD-YYYY hh:mm a')}</div>
						</div>
						<div className="justify-content-between align-items-center d-flex">
							<div>
								<div className="align-items-center d-flex">
									<StarRatings
										rating={review.rate}
										starRatedColor="rgb(230, 67, 47)"
										starDimension="20px"
										starSpacing="0px"
									/>
									<span className="ml-4 mt-1"><strong>{review.user.fullname}</strong> visited on {moment(review.visited).format('MM-DD-YYYY')}</span>
								</div>
								<p>{ review.comment }</p>
							</div>
							<Button className="btn-fill btn-success" onClick={() => reply(review)}>Reply</Button>
						</div>
					</Card.Body>
				</Card>
				))
				: <div className="align-center"><h4>No pending reviews</h4></div>
			}
			<Modal show={isModalOpen}>
				<Form onSubmit={submitReply}>
					<Modal.Header>Reply</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<label>Reply comment</label>
							<Form.Control
								type="text"
								placeholder="Reply comment"
								required
								onChange={(event) => setReplyComment(event.target.value)} />
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button type="submit" className="btn-fill btn-success" disabled={submitting}>Reply</Button>{' '}
						<Button className="btn-default" onClick={closeReplyModal}>Cancel</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default PendingReviews;