import { useQuery, gql } from "@apollo/client";
import {
  Thumbnail,
  Card,
  ResourceItem,
  ResourceList,
  TextStyle,
  Banner,
} from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";

const GET_FIRST_DRAFT_ORDER = gql`
  query GetAllDraftOrders {
    draftOrders(first: 1) {
      edges {
        node {
          id
          totalPrice
          lineItems(first: 10) {
            edges {
              node {
                id
                name
                quantity
                image {
                  url
                }
                originalUnitPrice
              }
            }
          }
        }
      }
    }
  }
`;

export const CartProducts = () => {
  const { loading, error, data } = useQuery(GET_FIRST_DRAFT_ORDER);

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <Card>
      <ResourceList
        resourceName={{ singular: "product", plural: "products" }}
        items={data.draftOrders.edges[0].node.lineItems.edges}
        renderItem={(item) => {
          const { id, name, originalUnitPrice, quantity, image } = item.node;
          const media = <Thumbnail source={image.url ? image.url : ""} />;

          return (
            <ResourceItem
              id={id}
              media={media}
              accessibilityLabel={`View details for ${name}`}
            >
              <h3>
                <TextStyle variation="strong">{name}</TextStyle>
              </h3>
              <div>${originalUnitPrice}</div>
              <div>QTY: {quantity}</div>
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
};
