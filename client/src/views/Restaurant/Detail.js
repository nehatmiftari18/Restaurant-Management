import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Button, Row, Col, Form, Card,
  Modal, Breadcrumb, BreadcrumbItem,
} from "react-bootstrap";
import moment from "moment";
import StarRatings from "react-star-ratings";
import DatePicker from "react-datepicker";
import cogoToast from "cogo-toast";

import { 
	getRestaurant, 
	getReviewsForRestaurant, 
	createReview, 
	replyReview, 
	deleteReview, 
	updateReview 
} from "apis";

function RestaurantDetails() {

	const navi = useHistory();
	const { id } = useParams();
	const [restaurant, setRestaurant] = React.useState(null);
	const [reviews, setReviews] = React.useState([]);
	const [myReview, setMyReview] = React.useState(null);
	const [rate, setRate] = React.useState(0);
	const [visitedDate, setVisitedDate] = React.useState(new Date());
	const [comment, setComment] = React.useState("");
	const [selectedReview, setSelectedReview] = React.useState(null);
	const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
	const [replyComment, setReplyComment] = React.useState("");
	const [replying, setReplying] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [deleting, setDeleting] = React.useState(false);
	const [editing, setEditing] = React.useState(false);

	const token = useSelector(state => state.token);
	const user = useSelector(state => state.user);

	useEffect(() => {
		getRestaurantDetails();
		getReviews();
	}, []);

	const getRestaurantDetails = async () => {
		try {
			const result = await getRestaurant(id, token);			
			setRestaurant(result.restaurant);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	const getReviews = async () => {
		try {
			const result = await getReviewsForRestaurant(id, token);
			setReviews(result.reviews);
			const myReview = result.reviews.find(review => review.user._id === user._id);
			setMyReview(myReview);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setLoading(true);

			const result = await createReview(id, { rate, visited: visitedDate, comment }, token);
			getRestaurantDetails();
			getReviews();
			setMyReview(result.review);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);

		} finally {
			setLoading(false);
		}
	}

	const onReply = (review) => {
		setSelectedReview(review);
		setIsReplyModalOpen(true);
		setReplyComment("");
	}

	const toggleReplyModal = () => {
		setIsReplyModalOpen(!isReplyModalOpen);
		setSelectedReview(null);		
	}

	const submitReply = async (event) => {
		event.preventDefault();

		try {
			setReplying(true);
			await replyReview(selectedReview._id, replyComment, token)
			getReviews();

			toggleReplyModal();
			cogoToast.success("Succeed to reply comment");

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);

		} finally {
			setReplying(false);
		}
	}

	const onDelete = (review) => {
		setIsDeleteModalOpen(true);
		setSelectedReview(review);
  	}

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
	}

	const onConfirmDelete = async () => {
		try {
			setDeleting(true);
			await deleteReview(selectedReview._id, token);

			const _reviews = [];
			reviews.forEach(review => {
				if (review._id !== selectedReview._id) {
					_reviews.push(review);
				}
			});

			setReviews(_reviews);
			getRestaurantDetails();
			closeDeleteModal();

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);

		} finally {
			setDeleting(false);
		}
	}

	const onEdit = (review) => {
		setSelectedReview(review);
		setIsEditModalOpen(true);
		setRate(review.rate);
		setComment(review.comment);
		setReplyComment(review.replyComment);
  	}

	const closeEditModal = () => {
		setIsEditModalOpen(false);
	}

	const editReview = async (event) => {
		event.preventDefault();
    
		try {
			setEditing(true);
			await updateReview(selectedReview._id, {rate, comment, replyComment}, token);

			getReviews();
			getRestaurantDetails();
			closeEditModal();

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);

		} finally {
			setEditing(false);
		}
  	}

  	return (
		<div className="animated fadeIn h-100 w-100">
			<Breadcrumb>
				<BreadcrumbItem href="#" onClick={() => navi.push('/restaurants')}>Restaurants</BreadcrumbItem>
				<BreadcrumbItem active>{restaurant ? restaurant.name : 'Not found'}</BreadcrumbItem>
			</Breadcrumb>
			{ restaurant? 
			<Row>
				<Col xs="12" md={user.role === 'regular' ? 6 : 12}>
					<Card>
						<Card.Header>
							<strong>Overview</strong>
						</Card.Header>
						<Card.Body>
							<Form.Group>
								<Col xs="12" md={user.role === 'regular' ? 6 : 3}>
									<label><strong>Name</strong></label>
								</Col>
								<Col xs="12" md={user.role === 'regular' ? 6 : 9}>
									<p className="form-control-static">{restaurant.name}</p>
								</Col>
							</Form.Group>
							<Form.Group>
								<Col xs="12" md={user.role === 'regular' ? 6 : 3}>
									<label><strong>Owner</strong></label>
								</Col>
								<Col xs="12" md={user.role === 'regular' ? 6 : 9}>
									<p className="form-control-static">{restaurant.owner.fullname}</p>
								</Col>
							</Form.Group>
							<Form.Group>
								<Col xs="12" md={user.role === 'regular' ? 6 : 3}>
									<label><strong>Average rating</strong></label>
								</Col>
								<Col xs="12" md={user.role === 'regular' ? 6 : 9}>
								{ restaurant.rateAvg > 0
									? <div style={{ marginBottom: '1em' }}>
										<StarRatings
											rating={restaurant.rateAvg}
											starRatedColor="rgb(230, 67, 47)"
											starDimension="20px"
											starSpacing="0px"
										/>
									</div>
									: <div style={{ marginBottom: '1em' }}><i>No review</i></div>
								}
								</Col>
							</Form.Group>
							<Form.Group>
								<Col xs="12" md={user.role === 'regular' ? 6 : 3}>
									<label><strong>Highest rated review</strong></label>
								</Col>
								<Col xs="12" md={user.role === 'regular' ? 6 : 9}>
								{ restaurant.highestReview
									? <div>
										<StarRatings
											rating={restaurant.highestReview.rate}
											starRatedColor="rgb(230, 67, 47)"
											starDimension="20px"
											starSpacing="0px"
										/>
										<p className="form-control-static">
											{restaurant.highestReview.comment}
										</p>
									</div>
									: <div><i>No review</i></div>
								}
								</Col>
							</Form.Group>
							<Form.Group>
								<Col xs="12" md={user.role === 'regular' ? 6 : 3}>
									<label><strong>Lowest rated review</strong></label>
								</Col>
								<Col xs="12" md={user.role === 'regular' ? 6 : 9}>
								{ restaurant.lowestReview
									? <div>
										<StarRatings
											rating={restaurant.lowestReview.rate}
											starRatedColor="rgb(230, 67, 47)"
											starDimension="20px"
											starSpacing="0px"
										/>
										<p className="form-control-static">
											{restaurant.lowestReview.comment}
										</p>
									</div>
									: <div><i>No review</i></div>
								}
								</Col>
							</Form.Group>
							<Form.Group>
								<Col md="12">
									<label><strong>Reviews</strong></label>
								</Col>
								<Col md="12">
								{reviews.map((review, i) => 
									<Card key={`review-${i}`}>
										<Card.Body>
											<div className="d-flex justify-content-between align-items-center">
												<div className="d-flex align-items-center">
													<span className="mr-2 mt-1"><strong>{review.user.fullname}</strong></span>
													<StarRatings
														rating={review.rate}
														starRatedColor="rgb(230, 67, 47)"
														starDimension="20px"
														starSpacing="0px"
													/>
												</div>
												<div className="mt-2">{moment(review.created).format('MM-DD-YYYY hh:mm a')}</div>
											</div>
											<p className="form-control-static">
												<i>Visited on </i>{ moment(review.visited).format('MM-DD-YYYY') }
											</p>
											<p className="form-control-static">
												{ review.comment }
											</p>
											<div className="m-b-10"><strong>Reply</strong></div>
											<i>
												{review.status === 'pending' ? 'Pending' : review.replyComment}
											</i>
										</Card.Body>
										{user.role === 'owner' && review.status === 'pending' && 
										<Card.Footer className="align-end">
											<Button className="btn-fill btn-success" onClick={() => onReply(review)}>Reply</Button>
										</Card.Footer>
										}
										{user.role === 'admin'
										&& <Card.Footer className="align-end">
											<Button className="btn-fill btn-warning" onClick={() => onEdit(review)}>Edit</Button>
											<Button className="btn-fill btn-danger ml-3" onClick={() => onDelete(review)}>Delete</Button>
										</Card.Footer>
										}
									</Card>)}
								</Col>
							</Form.Group>
						</Card.Body>
					</Card>
				</Col>
				{user.role === 'regular'
					&& <Col xs="12" md="6">
						<Card>
							<Card.Header>
								<strong>My review</strong>
							</Card.Header>
							<Card.Body>
								{myReview
									? <>
									<Form.Group>
										<Col md="6">
											<label><strong>Rating</strong></label>
										</Col>
										<Col md="6" style={{ marginBottom: '1em' }}>
											<StarRatings
												rating={myReview.rate}
												starRatedColor="rgb(230, 67, 47)"
												starDimension="30px"
												starSpacing="5px"
											/>
										</Col>
									</Form.Group>
									<Form.Group>
										<Col md="6">
											<label><strong>Date visited</strong></label>
										</Col>
										<Col md="6">
											<p className="form-control-static">{moment(myReview.visited).format('MM-DD-YYYY')}</p>
										</Col>
									</Form.Group>
									<Form.Group>
										<Col md="6">
											<label><strong>Comment</strong></label>
										</Col>
										<Col md="6">
											<p className="form-control-static">{myReview.comment}</p>
										</Col>
									</Form.Group>
									<Form.Group>
										<Col md="6">
											<label><strong>Reply</strong></label>
										</Col>
										<Col md="6">
											<p className="form-control-static">
												{myReview.status === 'pending' ? <i>Pending</i> : myReview.replyComment}
											</p>
										</Col>
									</Form.Group>
								</>
									: 
									<Form onSubmit={ handleSubmit }>
										<Form.Group className="custom-form-group">
											<label>Rating</label>
											<div>
												<StarRatings
													numberOfStars={5}
													rating={rate}
													changeRating={value => setRate(value)}
													starRatedColor="rgb(230, 67, 47)"
													starHoverColor="rgb(230, 67, 47)"
													starDimension="30px"
													starSpacing="5px"
												/>
											</div>
										</Form.Group>

										<Form.Group className="custom-form-group">
											<label>Date visited</label>
											<div className="m-b-10">
												<DatePicker
													selected={visitedDate}
													onChange={date => setVisitedDate(date)}
													maxDate={new Date()}
													className="form-control"
												/>
											</div>
										</Form.Group>

										<Form.Group>
											<label>Comment</label>
											<Form.Control
												type="text"
												placeholder="Comment"
												required
												onChange={(event) => setComment(event.target.value)} />
										</Form.Group>
										
										<div className="d-flex justify-content-center align-items-center">
											<Button type="submit" className="btn-fill btn-success" disabled={loading}>
												Comment
											</Button>
										</div>
									</Form>
								}
							</Card.Body>
						</Card>
					</Col>
				}
			</Row>
			: <div className="align-center"><h4>Restaurant does not exist</h4></div>
		}
			<Modal show={!!selectedReview && isReplyModalOpen}>
				<Form onSubmit={submitReply}>
					<Modal.Body>
						<label><strong>Reply comment</strong></label>
						<textarea className="form-control" value={replyComment} onChange={(event) => setReplyComment(event.target.value) } required />
					</Modal.Body>
					<Modal.Footer>
						<Button type="submit" className="btn-fill btn-success" disabled={replying}>Reply</Button>{' '}
						<Button className="btn-default" onClick={toggleReplyModal}>Cancel</Button>
					</Modal.Footer>
				</Form>
			</Modal>

			<Modal show={isDeleteModalOpen && !!selectedReview}>
				<Modal.Body>
							Are you sure you want to delete the review?
				</Modal.Body>
				<Modal.Footer>
				<Button type="submit" className="btn-fill btn-danger" onClick={ onConfirmDelete } disabled={deleting}>Delete</Button>{' '}
				<Button className="btn-default" onClick={ closeDeleteModal }>Cancel</Button>
				</Modal.Footer>
			</Modal>
			
			<Modal show={!!selectedReview && isEditModalOpen}>
				<Form onSubmit={editReview}>
					<Modal.Header><h4>Edit Review</h4></Modal.Header>
					<Modal.Body>
						<Form.Group>
							<label><strong>Rating</strong></label>
							<div className="mb-3 custom-form-group">
								<StarRatings
									rating={rate}
									starRatedColor="rgb(230, 67, 47)"
									starDimension="30px"
									starSpacing="5px"
									changeRating={(value) => setRate(value)}
									numberOfStars={5}
								/>								
							</div>
						</Form.Group>
						<Form.Group className="custom-form-group">
							<label><strong>Comment</strong></label>
							<textarea className="form-control" value={comment} onChange={(event) => setComment(event.target.value)} required />
						</Form.Group>
						{selectedReview && selectedReview.status !== 'pending'
						&& <Form.Group className="custom-form-group">
							<label><strong>Reply comment</strong></label>
							<textarea className="form-control" value={replyComment} onChange={(event) => setReplyComment(event.target.value)} required />
						</Form.Group>
						}
					</Modal.Body>
					<Modal.Footer>
						<Button type="submit" className="btn-fill btn-success" disabled={editing}>Update</Button>{' '}
						<Button className="btn-default" onClick={closeEditModal}>Cancel</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default RestaurantDetails;