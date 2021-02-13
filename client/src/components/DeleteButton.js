import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";

import {
	DELETE_POST_MUTATION,
	FETCH_POSTS_QUERY,
	DELETE_COMMENT_MUTATION,
} from "../utils/queries";

function DeleteButton({ postId, callback, commentId }) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const _mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePost] = useMutation(_mutation, {
		variables: {
			postId,
			commentId,
		},
		update(proxy) {
			setIsConfirmOpen(false);

			// If deleting a comment.
			if (!commentId) {
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
			}

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
			<Popup
				content={commentId ? "Delete Comment" : "Delete Post"}
				inverted
				trigger={
					<Button
						as="div"
						color="red"
						floated="right"
						onClick={() => setIsConfirmOpen(true)}
					>
						<Icon name="trash" style={{ margin: 0 }} />
					</Button>
				}
			/>

			<Confirm
				open={isConfirmOpen}
				onCancel={() => setIsConfirmOpen(false)}
				onConfirm={() => deletePost()}
			/>
		</>
	);
}

export default DeleteButton;
