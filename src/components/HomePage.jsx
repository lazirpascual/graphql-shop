import { useQuery, gql } from "@apollo/client";
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
import { useState } from "react";
import { MediaPage } from "./MediaPage";
import { GET_ALL_PRODUCTS } from "../queries/graphql";

export const HomePage = ({ productIds, setProductIds }) => {
  const navigateTo = useNavigate();
  const [hasResults, setHasResults] = useState(false); // state for Product Banner (when adding to cart)
  const [productName, setProductName] = useState(""); // state for Product Name in Banner
  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);

  if (loading) return <Loading />;

  if (error) {
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
        hasNext: true,
        onNext: () => {},
        hasPrevious: false,
        onPrevious: () => {},
      }}
    >
      {bannerMarkup}
      <Layout>
        {data?.products.edges.map((product) => {
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
              hasPrevious={false}
              onPrevious={() => {}}
              hasNext
              onNext={() => {}}
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
