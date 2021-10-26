import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
	Form,
	Container,
	Row,
	Col,
	Card,
	Button,
} from "react-bootstrap";
import cogoToast from "cogo-toast";

import { registerUser } from "apis";
import { setToken, updateUser } from "store/actions";

const roles = [{
	label: 'Regular',
	value: 'regular'
}, {
	label: 'Owner',
	value: 'owner'
}];

function Register() {
	
  const dispatch = useDispatch();
	const navi = useHistory();
	const [role, setRole] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [fullname, setFullname] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();	

		setLoading(true);
		try {

			const result = await registerUser({
												role,
												email,
												fullname,
												password
											});
			
			setLoading(false);
			dispatch(updateUser(result.user));
			dispatch(setToken(result.token));
			
			navi.push('/restaurants');

		} catch (error) {
			setLoading(false);
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	const handleChangeConfirmPassword = (event) => {
		if (password !== event.target.value) {
			event.target.setCustomValidity("Invalid confirm password.");
		} else {
			event.target.setCustomValidity("");
		}
	}

  	return (
		<Container>
			<Row className="justify-content-center mt-5">
				<Col md="5">
					<Form onSubmit={ handleSubmit }>
						<Card className="p-4">
							<Card.Body>
								<h1>Register</h1>
								<p className="text-muted">Create your account</p>

								<Form.Group>
									<label>Role</label>
									<select className="form-control"
										required
										onChange={(event) => setRole(event.target.value)}>
										<option value="">Choose a role</option>
										{roles.map((role, key) =>
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
										onChange={(event) => setEmail(event.target.value.trim())}
									 />
								</Form.Group>

								<Form.Group>
									<label>Fullname</label>
									<Form.Control
										type="text"
										placeholder="Full name"
										required
										onChange={(event) => setFullname(event.target.value.trim())}
									 />
								</Form.Group>

								<Form.Group>
									<label>Password</label>
									<Form.Control
										type="password"
										placeholder="Password"
										required
										onChange={(event) => setPassword(event.target.value)}
									 />
								</Form.Group>

								<Form.Group>
									<label>Confirm Password</label>
									<Form.Control
										type="password"
										placeholder="Confirm Password"
										required
										onChange={ handleChangeConfirmPassword }
									 />
								</Form.Group>

								<div className="d-flex justify-content-between align-items-center mt-4">
									<Button
										type="submit"
										className="btn-fill btn-success"
										disabled={ loading }
									>
										Create Account
									</Button>
									<Link to="/login" disabled={ loading }>
										Already have an account?
									</Link>
								</div>
							</Card.Body>
						</Card>
					</Form>
				</Col>
			</Row>
		</Container>
	)
}

export default Register;