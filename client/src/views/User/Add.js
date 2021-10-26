import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Breadcrumb, BreadcrumbItem, Form } from "react-bootstrap";
import cogoToast from "cogo-toast";

import { createUser } from "apis";

const roles = [{
  label: 'Regular',
  value: 'regular',
}, {
  label: 'Owner',
  value: 'owner',
}];

function AddUser() {
  const navi = useHistory();
	const [role, setRole] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [fullname, setFullname] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [submitting, setSubmitting] = React.useState(false);

	const token = useSelector(state => state.token);

  const handleCancel = (event) => {
		event.preventDefault();
    	navi.push('/users');
  };

	const handleChangeConfirmPassword = (event) => {
		if (event.target.value !== password) {
			event.target.setCustomValidity("Invalid confirm password!");
		} else {
			event.target.setCustomValidity("");
		}
	}

	const handleSubmit = async(event) => {
		event.preventDefault();

		try {
			setSubmitting(true);
			await createUser({ email, fullname, role, password }, token);
			setSubmitting(false);
			cogoToast.success("Created user successfully.");
			navi.push("/users");

		} catch (error) {
			setSubmitting(false);
			console.log(error)
			cogoToast.error(error.data.message);
		}
	}

  return (
    <div className="animated fadeIn h-100 w-100">
		<Breadcrumb>
			<BreadcrumbItem href="#" onClick={handleCancel}>Users</BreadcrumbItem>
			<BreadcrumbItem active>New</BreadcrumbItem>
		</Breadcrumb>
     	<h2>Create new user</h2>
		<Form onSubmit={handleSubmit}>
			<Form.Group>
				<label>Role</label>
				<select className="form-control" required onChange={(event) => setRole(event.target.value)}>
					<option value="">Choose a role</option>
					{ roles.map((role, key) =>
						<option value={role.value} key={key}>{role.label}</option>
					)}
				</select>
			</Form.Group>
			
			<Form.Group>
				<label>Email</label>
				<Form.Control
					type="email"
					placeholder="Email"
					required
					onChange={(event) => setEmail(event.target.value.trim())} />
			</Form.Group>

			<Form.Group>
				<label>Full name</label>
				<Form.Control
					type="text"
					placeholder="Full name"
					required
					onChange={(event) => setFullname(event.target.value)} />
			</Form.Group>
			
			<Form.Group>
				<label>Password</label>
				<Form.Control
					type="password"
					placeholder="Password"
					required
					onChange={(event) => setPassword(event.target.value)} />
			</Form.Group>

			<Form.Group>
				<label>Confirm Password</label>
				<Form.Control
					type="password"
					placeholder="Confirm Password"
					required
					onChange={handleChangeConfirmPassword} />
			</Form.Group>

			<div className="d-flex justify-content-between align-items-center">
				<Button type="submit" className="btn-fill btn-success" disabled={submitting}>
					Create
				</Button>
				<Button className="btn-default" onClick={handleCancel}>
					Cancel
				</Button>
			</div>
		</Form>
    </div>
  );
}

export default AddUser;