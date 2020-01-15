import gql from "graphql-tag";

export const CREATE_SNIPPET = gql`
  mutation snippet($input: SnippetInput!, $token: String!) {
    createSnippet(input: $input, token: $token) {
      id
      uid
      content
      sourceUrl
      description
    }
  }
`;

export const DELETE_SNIPPET = gql`
  mutation deleteSnippet($token: String!, $snippetId: Int!) {
    deleteSnippet(token: $token, snippetId: $snippetId) {
      status
      message
    }
  }
`;

export const UPDATE_SNIPPET = gql`
  mutation UpdateSnippet(
    $snippetId: Int!
    $snippetInfo: SnippetInput!
    $token: String!
  ) {
    updateSnippet(
      input: $snippetInfo
      snippetId: $snippetId
      token: $token
    ) {
      id
      title
      description
      content
      tags
    }
  }
`;
