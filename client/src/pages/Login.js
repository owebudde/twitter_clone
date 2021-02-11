import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";

function Login(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		username: "",
		password: "",
	});

	/**
	 * Submit handling...
	 */
	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(proxy, result) {
			context.login(result.data.login);
			props.history.push("/");
		},
		onError: async (err) => {
			if (err.graphQLErrors.length) {
				console.log("graphQLErrors", err, err.graphQLErrors);
				setErrors(err.graphQLErrors[0].extensions.exception.errors);
			}
		},
		variables: values,
	});

	function loginUserCallback() {
		loginUser();
	}

	return (
		<div className="form-container">
			<h1>Login</h1>

			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
				<h3>Login</h3>

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
					label="Password"
					placeholder="Password"
					name="password"
					type="password"
					value={values.password}
					onChange={onChange}
					error={errors.password ? true : false}
				/>

				<Button type="submit" primary>
					Login
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
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
