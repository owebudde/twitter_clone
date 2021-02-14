import React, { useContext, useState, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";

import { FETCH_POST_QUERY, CREATE_COMMENT_MUTATION } from "../utils/queries";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
	const postId = props.match.params.postId;
	const [commentBody, setCommentBody] = useState("");
	const commentInputRef = useRef(null);
	const { user } = useContext(AuthContext);
	const { data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
		onCompleted() {},
	});

	const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
		variables: {
			postId,
			body: commentBody,
		},
		update() {
			setCommentBody("");
			commentInputRef.current.blur();
		},
	});
	if (!data) {
		return <p>Loading Post...</p>;
	}

	function deletePostCallback() {
		props.history.push("/");
	}

	const {
		id,
		body,
		createdAt,
		username,
		comments,
		likes,
		likeCount,
		commentCount,
	} = data.getPost;

	return (
		<Grid>
			<Grid.Row>
				<Grid.Column width={2}>
					<Image
						src="https://react.semantic-ui.com/images/avatar/large/molly.png"
						size="small"
						float="right"
					/>
				</Grid.Column>

				<Grid.Column width={10}>
					<Card fluid>
						<Card.Content>
							<Card.Header>{username}</Card.Header>
							<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
							<Card.Description>{body}</Card.Description>
						</Card.Content>

						<hr />

						<Card.Content extra>
							<LikeButton user={user} post={{ id, likeCount, likes }} />
							<Button
								as="div"
								labelPosition="right"
								onClick={() => console.log("comment on the post")}
							>
								<Button basic color="blue">
									<Icon name="comments" />
								</Button>
								<Label basic color="blue" pointing="left">
									{commentCount}
								</Label>
							</Button>

							{user && user.username === username && (
								<DeleteButton postId={id} callback={deletePostCallback} />
							)}
						</Card.Content>
					</Card>

					{user && (
						<Card fluid>
							<div className="ui action input flui">
								<input
									type="text"
									placeholder="Comment body..."
									name="comment"
									value={commentBody}
									onChange={(event) => setCommentBody(event.target.value)}
								/>
								<button
									type="submit"
									className="ui button teal"
									disabled={commentBody.trim() === ""}
									onClick={submitComment}
									ref={commentInputRef}
								>
									Add Comment
								</button>
							</div>
						</Card>
					)}

					{comments.length &&
						comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<DeleteButton postId={id} commentId={comment.id} />
									)}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}

export default SinglePost;
