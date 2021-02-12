import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button, Icon, Label } from "semantic-ui-react";

// Relative Imports.
import { LIKE_POST_MUTATION } from "../utils/queries";

function LikeButton({ user, post: { id, likes, likeCount } }) {
	const [liked, setLiked] = useState(false);

	// FIXME: Getting User is null on fresh app start (for now pass empty obj conditional in parent).
	useEffect(() => {
		const likeUsernameMatch = likes.find((like) => like.username === user.username);
		if (user && likeUsernameMatch) {
			setLiked(true);
		} else {
			setLiked(false);
		}
	}, [user, likes]);

	// Only error that could happen, is token stuff,
	// which is handled elsewhere.
	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	const LikeButton = user ? (
		liked ? (
			<Button as="div" color="teal">
				<Icon name="heart" />
			</Button>
		) : (
			<Button as="div" color="teal" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} to="login" color="teal" basic>
			<Icon name="heart" />
		</Button>
	);

	return (
		<Button as="div" labelPosition="right" onClick={likePost}>
			{LikeButton}

			<Label basic color="teal" pointing="left">
				{likeCount}
			</Label>
		</Button>
	);
}

export default LikeButton;
