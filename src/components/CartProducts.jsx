import { useQuery, gql } from "@apollo/client";
import {
  Thumbnail,
  Stack,
  Card,
  ResourceList,
  TextStyle,
  Banner,
} from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { GET_PRODUCTS_BY_ID } from "../queries/graphql";

export const CartProducts = ({ productIds, setProductIds }) => {
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_ID, {
    variables: { ids: productIds },
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const navigateTo = useNavigate();

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <Card>
      {data.nodes.length > 0 ? (
        <ResourceList // Defines your resource list component
          showHeader
          resourceName={{ singular: "Product", plural: "Products" }}
          items={data.nodes}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          promotedBulkActions={[
            {
              content: "Delete",
              onAction: () => {
                confirm(
                  "Are you sure you want to remove this product(s) from the cart?"
                ) &&
                  setProductIds(
                    productIds.filter((id) => !selectedItems.includes(id))
                  );
              },
            },
          ]}
          renderItem={(item) => {
            const media = (
              <Thumbnail
                source={
                  item.images.edges[0]
                    ? item.images.edges[0].node.originalSrc
                    : ""
                }
                alt={
                  item.images.edges[0] ? item.images.edges[0].node.altText : ""
                }
              />
            );
            const price = item.variants.edges[0].node.price;
            return (
              <ResourceList.Item
                id={item.id}
                media={media}
                accessibilityLabel={`View details for ${item.title}`}
                onClick={() => navigateTo(`/${item.id}`)}
              >
                <Stack>
                  <Stack.Item fill>
                    <h3>
                      <TextStyle variation="strong">{item.title}</TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item>
                    <p>${price}</p>
                  </Stack.Item>
                </Stack>
              </ResourceList.Item>
            );
          }}
        />
      ) : (
        <Banner status="info">
          There are currently no products in this cart.
        </Banner>
      )}
    </Card>
  );
};
