import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { SQUID_URI, QUERY_LIMIT } from ".";
import fetch from "cross-fetch";

export const fetchVerifiedContracts = async () => {
  const squidClient = new ApolloClient({
    link: new HttpLink({
      uri: `${SQUID_URI}`,
      fetch,
    }),
    cache: new InMemoryCache(),
  });

  const allVerifiedContracts = [];
  let moreAvailable = true;
  let currIndex = 0;

  while (moreAvailable) {
    console.log(
      `Fetching verified contracts from Squid: ${currIndex} - ${
        currIndex + QUERY_LIMIT
      }`
    );
    const query = gql`query {
        verifiedContracts( limit: ${QUERY_LIMIT}, offset: ${currIndex} ) { id }
      }`;
    const response = await squidClient.query({ query: query });
    const verifiedContracts = response.data["verifiedContracts"];
    if (!verifiedContracts.length || verifiedContracts.length < QUERY_LIMIT) {
      moreAvailable = false;
    }
    allVerifiedContracts.push(...verifiedContracts);
    currIndex += QUERY_LIMIT;
  }
  return allVerifiedContracts;
};
