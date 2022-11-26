import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const endpoint = "http://localhost:4000/graphql";

const getCurrencies = axios({
    url: endpoint,
    method: 'post',
    data: {
      getCurrencies
    }
}).then((result) => {
    console.log(result.data)
}).catch((err) => console.log(err);

export default Data;