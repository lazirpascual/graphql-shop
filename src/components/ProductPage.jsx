import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router";
import { Banner } from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import React from "react";

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
    }
  }
`;

export const ProductPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: {
      id: "gid://shopify/Product/" + id,
    },
  });

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return <div>{data.product.title}</div>;
};
