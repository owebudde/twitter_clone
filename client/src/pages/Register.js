import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";

const Register = (props) => {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	/**
	 * Submit handling...
	 */
	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			// context.login(userData);
			context.login(userData);
			props.history.push("/");
		},
		onError(err) {
			console.log("Register on error: ", err, err.graphQLErrors);
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	// Hacky hoisting lift.
	function registerUser() {
		addUser();
	}

	return (
		<div className="form-container">
			<h1>Register</h1>

			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
				<h3>Register</h3>

				<Form.Input
					label="Username"
					placeholder="Username"
					name="username"
					type="text"
					value={values.username}
					onChange={onChange}
					error={errors.username ? true : false}
				/>

				<Form.Input
					label="Email"
					placeholder="bob@email.com"
					name="email"
					type="text"
					value={values.email}
					onChange={onChange}
					error={errors.email ? true : false}
				/>

				<Form.Input
					label="Password"
					placeholder="Password"
					name="password"
					type="password"
					value={values.password}
					onChange={onChange}
					error={errors.password ? true : false}
				/>

				<Form.Input
					label="Confirm Password"
					placeholder="Password"
					name="confirmPassword"
					type="password"
					value={values.confirmPassword}
					onChange={onChange}
					error={errors.confirmPassword ? true : false}
				/>

				<Button type="submit" primary>
					Register
				</Button>
			</Form>

			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
