import React from "react";
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from "@apollo/client";

import App from "./App";

const httpLink = createHttpLink({
	uri: "http://localhost:4200",
});

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});

const Provider = () => (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

export default Provider;
