import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";

import { FETCH_POST_QUERY } from "../utils/queries";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
	const postId = props.match.params.postId;
	const { user } = useContext(AuthContext);
	const { data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
		onCompleted() {},
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
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
}

export default SinglePost;
