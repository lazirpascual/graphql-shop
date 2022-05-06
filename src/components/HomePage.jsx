import { useQuery, gql, useLazyQuery } from "@apollo/client";
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
  Pagination,
} from "@shopify/polaris";
import { CartMajor } from "@shopify/polaris-icons";
import { Loading } from "@shopify/app-bridge-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MediaPage } from "./MediaPage";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 6, sortKey: PRODUCT_TYPE) {
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

const GET_NEXT_PAGE = gql`
  query GetAllProducts($after: String!) {
    products(first: 6, after: $after, sortKey: PRODUCT_TYPE) {
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

const GET_PREV_PAGE = gql`
  query GetAllProducts($before: String!) {
    products(last: 6, before: $before, sortKey: PRODUCT_TYPE) {
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

export const HomePage = ({ productIds, setProductIds }) => {
  const navigateTo = useNavigate();
  const [hasResults, setHasResults] = useState(false); // state for Product Banner (when adding to cart)
  const [productName, setProductName] = useState(""); // state for Product Name in Banner
  const [productData, setProductData] = useState([]); // product data used for fetched GraphQL data
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);
  const [
    getNextPage,
    { loading: nextLoading, data: nextData, error: nextError },
  ] = useLazyQuery(GET_NEXT_PAGE);
  const [
    getPrevPage,
    { loading: prevLoading, error: prevError, data: prevData },
  ] = useLazyQuery(GET_PREV_PAGE);

  useEffect(() => {
    setProductData(data?.products.edges);
    setPageInfo(data?.products.pageInfo);
  }, [data]);

  useEffect(() => {
    console.log(nextData);
    setProductData(nextData?.products.edges);
    setPageInfo(nextData?.products.pageInfo);
  }, [nextData]);

  useEffect(() => {
    console.log(prevData);
    setProductData(prevData?.products.edges);
    setPageInfo(prevData?.products.pageInfo);
  }, [prevData]);

  if (loading || nextLoading || prevLoading) return <Loading />;

  if (error || nextError || prevError) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  const bannerMarkup = hasResults && (
    <Banner
      title={`${productName} has been added to the cart!`}
      status="success"
      action={{ content: "View Cart", onAction: () => navigateTo(`/cart`) }}
      onDismiss={() => setHasResults(false)}
    />
  );

  return (
    <Page
      fullWidth
      title="Products"
      divider
      titleMetadata={<Badge status="success">Admin</Badge>}
      primaryAction={{
        content: `View Cart (${productIds.length})`,
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
      pagination={{
        hasNext: pageInfo?.hasNextPage,
        onNext: () => {
          getNextPage({
            variables: {
              first: 6,
              after: productData.length
                ? productData[productData.length - 1].cursor
                : "",
            },
          });
          console.log("next");
        },
        hasPrevious: pageInfo?.hasPreviousPage,
        onPrevious: () => {
          getPrevPage({
            variables: {
              last: 6,
              before: productData.length ? productData[0].cursor : "",
            },
          });
          console.log("prev");
        },
      }}
    >
      {bannerMarkup}
      <Layout>
        {productData?.map((product) => {
          return (
            <Layout.Section oneHalf key={product.node.id}>
              <Card sectioned title={product.node.title}>
                <Link to={product.node.id}>
                  <Card.Section>
                    <Stack alignment="center" distribution="center">
                      <MediaPage images={product.node.images} />
                    </Stack>
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
                        setProductIds([...productIds, product.node.id]);
                        setHasResults(true);
                        setProductName(product.node.title);
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
        <Layout.Section>
          <Stack distribution="trailing">
            <Pagination
              label="Next"
              hasPrevious={pageInfo?.hasPreviousPage}
              onPrevious={() => {
                getPrevPage({
                  variables: {
                    last: 6,
                    before: productData.length ? productData[0].cursor : "",
                  },
                });
              }}
              hasNext={pageInfo?.hasNextPage}
              onNext={() => {
                getNextPage({
                  variables: {
                    first: 6,
                    after: productData.length
                      ? productData[productData.length - 1].cursor
                      : "",
                  },
                });
              }}
            />
          </Stack>
        </Layout.Section>
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
