import React, { useEffect }from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import { Button, Breadcrumb, BreadcrumbItem, Form, Card } from "react-bootstrap";
import { createRestaurant, getAllUsers } from "apis";


function AddRestaurant() {	
	const navi = useHistory();
	const [users, setUsers] = React.useState([]);
	const [name, setName] = React.useState("");
	const [owner, setOwner] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const token = useSelector(state => state.token);
	const user = useSelector(state => state.user);

	useEffect(() => {
		if (user.role === 'admin') {
			getUsers();
		}
	}, []);

	const getUsers = async () => {
		try {
			const result = await getAllUsers('owner', token);
			setUsers(result.users);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}
	
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			setLoading(true);
			await createRestaurant({ owner, name }, token);
			setLoading(false);

			cogoToast.success("Added restaurant successfully.");
			navi.push('/restaurants');

		} catch (error) {
			setLoading(false);
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
				<BreadcrumbItem href="#" onClick={ handleCancel }>Restaurants</BreadcrumbItem>
				<BreadcrumbItem active>New</BreadcrumbItem>
			</Breadcrumb>
			<Card>
				<Card.Body>
					<Form onSubmit={ handleSubmit }>
						<h3>Add a new restaurant</h3>
						{ user.role === 'admin' && 
							<Form.Group>
								<label>Owner</label>
								<select className="form-control" required onChange={(event) => setOwner(event.target.value)}>
									<option value="">Choose a owner</option>
									{
										users.map((user, key) => 
											<option value={user._id} key={key}>{user.email}</option>
										)
									}
								</select>
							</Form.Group>
						}

						<Form.Group>
							<label>Name</label>
							<Form.Control
								type="text"
								placeholder="Restaurant Name"
								required
								onChange={(event) => setName(event.target.value.trim())} />
						</Form.Group>
						
						<div className="d-flex justify-content-between align-items-center">
							<Button type="submit" className="btn-fill btn-success" disabled={loading}>
								Save
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

export default AddRestaurant;