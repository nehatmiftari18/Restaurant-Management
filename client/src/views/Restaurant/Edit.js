import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Breadcrumb, BreadcrumbItem, Form, Card } from "react-bootstrap";
import cogoToast from "cogo-toast";

import { getRestaurant, getAllUsers, updateRestaurant, getUserById } from "apis";

function EditRestaurant() {

	const navi = useHistory();
	const { id } = useParams();
	const [restaurant, setRestaurant] = React.useState(null);
	const [name, setName] = React.useState("");
	const [owner, setOwner] = React.useState("");
	const [users, setUsers] = React.useState([]);
	const [updating, setUpdating] = React.useState(false);

	const user = useSelector(state => state.user);
	const token = useSelector(state => state.token);

	useEffect(() => {
    getRestaurantDetails();
		if (user.role === 'admin') {
			getUsers();
		}
  }, []);

	const getRestaurantDetails = async () => {
		try {
			const result = await getRestaurant(id, token);			
			setRestaurant(result.restaurant);
			setName(result.restaurant.name);
			setOwner(result.restaurant.owner._id);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	const getUsers = async () => {
		try {
			const result = await getAllUsers("owner", token);
			setUsers(result.users);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setUpdating(true);
			await updateRestaurant(id, { owner, name} , token);
			setUpdating(false);
			cogoToast.success("Updated restaurant info successfully.")
			navi.push('/restaurants');

		} catch (error) {
			setUpdating(false);
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

  const handleCancel = (event) => {
	event.preventDefault();
    navi.push('/restaurants');
  };

  return (
    <div className="animated fadeIn h-100 w-100">
      	<Breadcrumb>
			<BreadcrumbItem href="#" onClick={handleCancel}>Restaurants</BreadcrumbItem>
			<BreadcrumbItem active>{restaurant ? restaurant.name: "...loading"}</BreadcrumbItem>
      	</Breadcrumb>
		<Card>
			<Card.Body>
				<h2>Edit restaurant</h2>
				<Form onSubmit={ handleSubmit }>
					{ user.role === 'admin' && 
					<Form.Group>
						<label>Owner</label>
						<select className="form-control" value={owner} required onChange={(event) => setOwner(event.target.value)}>
							<option value="">Choose a owner</option>
							{
								users.map((user, key) =>
								<option value={user._id} key={key}>{user.fullname}</option>
								)
							}
						</select>
					</Form.Group>
					}
					<Form.Group>
						<label>Name</label>
						<Form.Control
							type="text"
							placeholder="Name"
							required
							value={name}
							onChange={(event) => setName(event.target.value)}>

						</Form.Control>
					</Form.Group>
					
					<div className="d-flex justify-content-between align-items-center">
						<Button type="submit" className="btn-fill btn-success" disabled={updating}>
							Update
						</Button>
						<Button className="btn-default" onClick={ handleCancel }>
							Cancel
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
      
    </div>
  );
}

export default EditRestaurant;