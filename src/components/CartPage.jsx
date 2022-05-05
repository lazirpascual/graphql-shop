import { useQuery, gql } from "@apollo/client";
import React from "react";

const GET_ALL_DRAFT_ORDERS = gql`
  query GetAllDraftOrders {
    draftOrders(first: 1) {
      edges {
        node {
          id
          totalPrice
          lineItems(first: 10) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const CartPage = () => {
  const { loading, error, data } = useQuery(GET_ALL_DRAFT_ORDERS);
  console.log(data);
  return <div>CartPage</div>;
};
