import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from "../utils/queries";

function DeleteButton({ postId, callback }) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [deletePost] = useMutation(DELETE_POST_MUTATION, {
		variables: {
			postId,
		},
		update(proxy) {
			setIsConfirmOpen(false);

			// Remove post from cache.
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});

			const filteredPosts = data.getPosts.filter((post) => post.id !== postId);
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: {
					getPosts: filteredPosts,
				},
			});

			if (callback) {
				callback();
			}
		},
		onError(error) {
			console.log("WTF, cant delete post ", error);
		},
	});

	if (!deletePost) {
		return <p>loading...</p>;
	}

	return (
		<>
			<Button as="div" color="red" floated="right" onClick={() => setIsConfirmOpen(true)}>
				<Icon name="trash" style={{ margin: 0 }} />
			</Button>

			<Confirm
				open={isConfirmOpen}
				onCancel={() => setIsConfirmOpen(false)}
				onConfirm={() => deletePost()}
			/>
		</>
	);
}

export default DeleteButton;
