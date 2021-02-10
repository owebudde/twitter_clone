import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

const Register = (props) => {
	const [errors, setErrors] = useState({});
	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const onChange = (event) => {
		// Reset error.
		// if (Object.keys(errors).length > 0) {
		// 	console.log("Onchange Errors", errors);
		// 	const newErrors =
		// 	delete errors[event.target.name]
		// 	setErrors({
		// 		...errors,
		// 		Object. [event.target.name]
		// 	});
		// }

		// Set values.
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	/**
	 * Submit handling...
	 */
	const [addUser, { loading }] = useMutation(LOGIN_USER, {
		update(proxy, result) {
			console.log("Reg Submit result", result);
			props.history.push("/");
		},
		onError(err) {
			console.log("Submit onError func", err);
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	const onSubmit = (event) => {
		event.preventDefault();
		// All validation done server-side.
		addUser();

		// Clear the fields & redirect to home.
	};

	return (
		<div className="form-container">
			<h1>Register</h1>
			<h2>Built on MERN + GraphQL</h2>

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

const LOGIN_USER = gql`
	mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
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
