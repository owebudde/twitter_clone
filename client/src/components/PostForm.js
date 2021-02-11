import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Form } from "semantic-ui-react";

import { useForm } from "../utils/hooks";

function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: "",
	});

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			console.log("CREATE RES: ", result);
			values.body = "";
		},
	});

	return (
		<Form onSubmit={onSubmit}>
			<h3>Create a Post</h3>

			<Form.Field>
				<Form.Input
					placeholder="Post content"
					name="body"
					onChange={onChange}
					value={values.body}
				/>

				<Button type="submit" color="teal">
					Create
				</Button>
			</Form.Field>
		</Form>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation create_post($body: String!) {
		createPost(body: $body) {
			id
			username
			createdAt
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createAt
			}
			commentCount
		}
	}
`;

export default PostForm;
