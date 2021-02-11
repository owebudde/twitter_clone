import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { useForm } from "../utils/hooks";
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../utils/queries";

function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: "",
	});

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});

			const posts = [result.data.createPost, ...data.getPosts];

			proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: posts } });

			values.body = "";
		},
	});

	function createPostCallback() {
		createPost();
	}

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

export default PostForm;
