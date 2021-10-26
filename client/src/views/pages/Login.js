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
} from 'react-bootstrap';
import cogoToast from "cogo-toast";

import { loginUser } from "apis";
import { setToken, updateUser } from "store/actions";

function Login() {	
	const dispatch = useDispatch();
	const navi = useHistory();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();			

		setLoading(true);

		try {
			const result = await loginUser({ email, password});
			setLoading(false);
			dispatch(updateUser(result.user));
			dispatch(setToken(result.token));
			navi.push("/restaurants");
			
		} catch (error) {
			setLoading(false);
			console.log(error);
			cogoToast.error(error.data.message);
		}
	}

	return (
		<Container>
			<Row className="justify-content-center mt-5">
				<Col md="5">
					<Form onSubmit={ handleSubmit }>
						<Card className="p-4">
							<Card.Body>
								<h1>Login</h1>
								<p className="text-muted">Sign In to your account</p>

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
									<label>Password</label>
									<Form.Control
										type="password"
										placeholder="Password"
										required
										onChange={(event) => setPassword(event.target.value)}
									 />
								</Form.Group>

								<div className="d-flex align-items-center justify-content-between mt-4">
									<Button
											type="submit"
											className="px-4 btn-fill btn-success"
											disabled={ loading }
									>
										Login
									</Button>

									<Link to="/register">
									Don't have an account?
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

export default Login;