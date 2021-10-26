import React, { useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Breadcrumb, BreadcrumbItem, Form } from "react-bootstrap";
import cogoToast from "cogo-toast";

import { updateUser, getUserById } from "apis";

function EditUser() {
	const navi = useHistory();
	const { id } = useParams();
	const [user, setUser] = React.useState(null);
	const [email, setEmail] = React.useState("");
	const [fullname, setFullname] = React.useState("");
	const [updating, setUpdating] = React.useState(false);

	const token = useSelector(state => state.token);

	useEffect(() => {
		getUser();
	}, [])

	const getUser = async () => {
		try {
			const result = await getUserById(id, token);
			setUser(result.user);
			setEmail(result.user.email);
			setFullname(result.user.fullname);

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setUpdating(true);
			await updateUser(id, {email, fullname}, token)
			setUpdating(false);
			cogoToast.success("Updated user info successfully");
			navi.push("/users");

		} catch(error) {
			setUpdating(false);
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

  	const handleCancel = (event) => {
		event.preventDefault();
    	navi.push('/users');
  	};

  return (
		<div className="animated fadeIn h-100 w-100">
			<Breadcrumb>
				<BreadcrumbItem href="/users" onClick={handleCancel}>Users</BreadcrumbItem>
				<BreadcrumbItem active>{user? user.fullname: ""}</BreadcrumbItem>
			</Breadcrumb>
			<h2>Edit user</h2>
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<label>Email</label>
					<Form.Control
						type="email"
						placeholder="Email"
						required
						value={email}
						onChange={(event) => setEmail(event.target.value.trim())} />
				</Form.Group>

				<Form.Group>
					<label>Full name</label>
					<Form.Control
						type="text"
						placeholder="Full name"
						required
						value={fullname}
						onChange={(event) => setFullname(event.target.value)} />
				</Form.Group>
				
				<div className="d-flex justify-content-between align-items-center">
					<Button type="submit" className="btn-fill btn-success" disabled={updating}>
						Update
					</Button>
					<Button className="btn-default" onClick={handleCancel}>
						Cancel
					</Button>
				</div>
			</Form>
		</div>
	);
}

export default EditUser;