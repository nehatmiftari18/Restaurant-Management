import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button, Card, Form, Col,
} from "react-bootstrap";
import cogoToast from "cogo-toast";

import { updateProfile } from "apis";
import { updateUser } from "store/actions";

function Profile() {
  const dispatch = useDispatch();
	const [editMode, setEditMode] = React.useState(false);
	const [updating, setUpdating] = React.useState(false);

	const token = useSelector(state => state.token);
	const user = useSelector(state => state.user);

	const [email, setEmail] = React.useState(user.email);
	const [fullname, setFullname] = React.useState(user.fullname);
  
  	const toggleEdit = () => {
		setEditMode(!editMode);
  	}

  	const onEdit = () => {
		setEditMode(true);
  	}

  	const onUpdate = async(event) => {
		
		event.preventDefault();
		try {
			setUpdating(true);
			const result = await updateProfile({email, fullname}, token);
			dispatch(updateUser(result.user));
			setEditMode(false);
			cogoToast.success("Updated profile info successfully.");

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);

		} finally {
			setUpdating(false);
		}
  	}

  	return (
		<div className="animated fadeIn h-100 w-100">
			<Card className="w-50">
				<Card.Header>
					<strong>{editMode ? 'Edit Profile' : 'Your Profile'}</strong>
				</Card.Header>
				<Card.Body>
					{editMode ? (
						<Form onSubmit={onUpdate}>
							<Form.Group>
								<label>Email</label>
								<Form.Control
									type="email"
									placeholder="Email"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value.trim())}
								 	/>
							</Form.Group>

							<Form.Group>
								<label>Full name</label>
								<Form.Control
									type="text"
									placeholder="Full name"
									required
									value={fullname}
									onChange={(event) => setFullname(event.target.value)}
								 	/>
							</Form.Group>

							<div className="d-flex justify-content-between align-items-center">
								<Button type="submit" className="btn-fill btn-success" disabled={updating}>
									Update
								</Button>
								<Button className="btn-default" onClick={ toggleEdit }>
									Cancel
								</Button>
							</div>
						</Form>
					) :
					(
						<>
						<Form.Group>
							<Col xs="6">
								<label><strong>Email</strong></label>
							</Col>
							<Col xs="6">
								<p className="form-control-static">{user.email}</p>
							</Col>
						</Form.Group>
						<Form.Group>
							<Col xs="6">
								<label><strong>Full name</strong></label>
							</Col>
							<Col xs="6">
								<p className="form-control-static">{user.fullname}</p>
							</Col>
						</Form.Group>
						<Form.Group>
							<Col xs="12">
								<Button className="btn-fill btn-warning" onClick={ onEdit }>
									Edit
								</Button>
							</Col>
						</Form.Group>
						</>
						)
					}
				</Card.Body>
			</Card>
		</div>
	);
}

export default Profile;