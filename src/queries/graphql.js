import { gql } from "@apollo/client";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 20, sortKey: CREATED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          title
          images(first: 2) {
            edges {
              node {
                id
                originalSrc
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      productType
      totalInventory
      images(first: 3) {
        edges {
          node {
            id
            originalSrc
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            price
          }
        }
      }
    }
  }
`;

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              id
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation createProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
      }
    }
  }
`;

export { GET_ALL_PRODUCTS, GET_PRODUCT, GET_PRODUCTS_BY_ID, CREATE_PRODUCT };
