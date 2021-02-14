import React from "react";
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import App from "./App";

const httpLink = createHttpLink({
	uri: "https://rocky-woodland-09060.herokuapp.com/",
});

const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

const Provider = () => (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

export default Provider;
