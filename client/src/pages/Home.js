import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

const Home = () => {
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	return (
		<Grid columns={3}>
			<Grid.Row textAlign="center" centered>
				<h1>Welcome to TwitterClone</h1>
			</Grid.Row>
			<Grid.Row textAlign="center" centered>
				<h2>Built on MERN + GraphQL</h2>
			</Grid.Row>

			<Grid.Row>
				{loading ? (
					<h3>Loading posts...</h3>
				) : (
					data.getPosts &&
					data.getPosts.map((post) => (
						<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
							<PostCard post={post} />
						</Grid.Column>
					))
				)}
			</Grid.Row>
		</Grid>
	);
};

// TODO: Chunk out to class.
const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default Home;
