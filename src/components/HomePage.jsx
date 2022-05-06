import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  Page,
  Layout,
  Banner,
  Card,
  Button,
  Stack,
  DisplayText,
  FooterHelp,
  Badge,
  Link as PolarisLink,
  Icon,
} from "@shopify/polaris";
import { CartMajor } from "@shopify/polaris-icons";
import { Loading } from "@shopify/app-bridge-react";
import { Link, useNavigate } from "react-router-dom";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 20, sortKey: PRODUCT_TYPE) {
      edges {
        node {
          id
          title
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
              }
            }
          }
        }
      }
    }
  }
`;

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

const UPDATE_DRAFT_ORDER = gql`
  mutation DraftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
    draftOrderUpdate(id: $id, input: $input) {
      draftOrder {
        id
      }
    }
  }
`;

export const HomePage = () => {
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);
  const navigateTo = useNavigate();
  const [fetchDraftOrder, { data: draftOrderData }] = useLazyQuery(
    GET_FIRST_DRAFT_ORDER
  );
  const [updateDraftOrder] = useMutation(UPDATE_DRAFT_ORDER);

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <Page
      fullWidth
      title="Products"
      divider
      titleMetadata={<Badge status="success">Admin</Badge>}
      primaryAction={{
        content: "View Cart",
        icon: <Icon source={CartMajor} />,
        onAction: () => navigateTo(`/cart`),
      }}
      secondaryActions={[
        {
          content: "Create Product",
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Duplicate action"),
        },
      ]}
    >
      <Layout>
        {data.products.edges.map((product) => {
          return (
            <Layout.Section oneHalf key={product.node.id}>
              <Card sectioned title={product.node.title}>
                <Link to={product.node.id}>
                  <Card.Section>
                    <img
                      alt=""
                      width="400px"
                      height="320px"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      src={product.node.images.edges[0].node.originalSrc}
                    />
                  </Card.Section>
                </Link>
                <Card.Section title="price">
                  <Stack distribution="equalSpacing">
                    <DisplayText size="small">
                      ${product.node.variants.edges[0].node.price}{" "}
                    </DisplayText>
                    <Button
                      primary
                      onClick={() => {
                        fetchDraftOrder();

                        if (draftOrderData) {
                          updateDraftOrder({
                            variables: {
                              id: draftOrderData.draftOrders.edges[0].node.id,
                              input: {
                                lineItems: [
                                  { variantId: product.node.id, quantity: 1 },
                                ],
                              },
                            },
                          });
                        }
                      }}
                    >
                      Add To Cart
                    </Button>
                  </Stack>
                </Card.Section>
              </Card>
            </Layout.Section>
          );
        })}
      </Layout>
      <FooterHelp>
        Copyright ©{" "}
        <PolarisLink url="https://github.com/lazirpascual/graphql-shop">
          GraphQL-Shop
        </PolarisLink>{" "}
        2022.
      </FooterHelp>
    </Page>
  );
};
