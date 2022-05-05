import { useQuery, gql } from "@apollo/client";
import {
  Page,
  Layout,
  Banner,
  Card,
  MediaCard,
  Button,
  Stack,
  Subheading,
  DisplayText,
} from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 10) {
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
          variants(first: 10) {
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

export const HomePage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_PRODUCTS);

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <Page fullWidth title="Products">
      <Layout>
        {data.products.edges.map((product) => {
          return (
            <Layout.Section oneHalf>
              <Card
                sectioned
                title={product.node.title}
                description={product.node.variants.edges[0].node.price}
                size="medium"
              >
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
                <Card.Section>
                  <Stack distribution="equalSpacing">
                    <DisplayText size="small">
                      ${product.node.variants.edges[0].node.price}{" "}
                    </DisplayText>
                    <Button primary>Add To Cart</Button>
                  </Stack>
                </Card.Section>
              </Card>
            </Layout.Section>
          );
        })}
      </Layout>
    </Page>
  );
};
