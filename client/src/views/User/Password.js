import React from "react";
import { useSelector } from "react-redux";
import {
  Button, Card, Form
} from "react-bootstrap";
import cogoToast from "cogo-toast";

import { changePassword }  from "apis";

function Password() {
	
	const [oldPassword, setOldPassword] = React.useState("");
	const [newPassword, setNewPassword]  = React.useState("");
	const [confirmPassword, setConfirmPassword]  = React.useState("");
	const [updating, setUpdating] = React.useState(false);

	const token = useSelector(state => state.token);

	const handleChangeConfirmPassword = (event) => {
		setConfirmPassword(event.target.value);

		if (event.target.value !== newPassword) {
			event.target.setCustomValidity("Invalid confirm password");

		} else {
			event.target.setCustomValidity("");
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setUpdating(true);
			await changePassword({ oldPassword, newPassword }, token);
			cogoToast.success("Changed password successfully.");
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");

		} catch (error) {
			console.log(error);
			cogoToast.error(error.data.message)

		} finally {
			setUpdating(false);
		}
	}

	return (
		<div className="animated fadeIn h-100 w-100">
			<Card className="w-50">
				<Card.Header>
					Change Password
				</Card.Header>
				<Card.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<label>Old Password</label>
							<Form.Control
								type="password"
								placeholder="Old password"
								required
								value={oldPassword}
								onChange={(event) => setOldPassword(event.target.value)}
							/>
						</Form.Group>

						<Form.Group>
							<label>New Password</label>
							<Form.Control
								type="password"
								placeholder="New password"
								required
								value={newPassword}
								onChange={(event) => setNewPassword(event.target.value) }
							/>
						</Form.Group>

						<Form.Group>
							<label>Confirm Password</label>
							<Form.Control
								type="password"
								placeholder="Confirm password"
								required
								value={confirmPassword}
								onChange={ handleChangeConfirmPassword }
							/>
						</Form.Group>

						<div className="d-flex justify-content-center align-items-center">
							<Button type="submit" className="btn-fill btn-success" disabled={updating}>
								Change
							</Button>
						</div>
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
}

export default Password