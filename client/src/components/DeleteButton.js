import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { DELETE_POST_MUTATION } from "../utils/queries";

function DeleteButton({ postId }) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const [deletePost] = useMutation(DELETE_POST_MUTATION, {
		variables: {
			postId,
		},
		update() {
			setIsConfirmOpen(false);
			// TODO: remove post from cache.
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
