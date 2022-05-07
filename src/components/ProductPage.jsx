import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  Banner,
  DisplayText,
  Page,
  PageActions,
  Card,
  FooterHelp,
  Link,
  Badge,
  Icon,
  Stack,
  TextStyle,
  Spinner,
} from "@shopify/polaris";
import { CartMajor } from "@shopify/polaris-icons";
import { useState } from "react";
import { GET_PRODUCT } from "../queries/graphql";

export const ProductPage = ({ productIds, setProductIds }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: {
      id: `gid://shopify/Product/${id}`,
    },
  });
  const [hasResults, setHasResults] = useState(false);
  const [productName, setProductName] = useState("");

  if (loading)
    return (
      <Stack alignment="fill" distribution="center" spacing="loose">
        <Spinner size="large" />
      </Stack>
    );

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
      fullwidth
      title="Product Info"
      divider
      titleMetadata={<Badge status="success">Admin</Badge>}
      primaryAction={{
        content: `View Cart (${productIds.length})`,
        icon: <Icon source={CartMajor} />,
        onAction: () => navigateTo(`/cart`),
      }}
      secondaryActions={[
        {
          content: "Back To Products",
          onAction: () => navigateTo(`/`),
        },
      ]}
    >
      {bannerMarkup}
      <Card sectioned title={data.product.title}>
        <Card.Section>
          <Stack alignment="center" distribution="fill" wrap={true}>
            <img
              alt=""
              width="400px"
              height="350px"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              src={data.product.images.edges[2].node.originalSrc}
            />
            <Stack vertical={true}>
              <TextStyle variation="strong">
                Type: {data.product.productType}
              </TextStyle>
              <TextStyle
                variation={
                  data.product.totalInventory < 10 ? "negative" : "positive"
                }
              >
                {data.product.totalInventory} in stock
              </TextStyle>
            </Stack>
          </Stack>
        </Card.Section>
        <Card.Section title="Price">
          <Card.Subsection>
            <DisplayText size="medium">
              ${data.product.variants.edges[0].node.price}
            </DisplayText>
          </Card.Subsection>
        </Card.Section>
        <Card.Section title="Description">
          <Card.Subsection>{data.product.description}</Card.Subsection>
        </Card.Section>
      </Card>
      <PageActions
        primaryAction={{
          content: "Add To Cart",
          onAction: () => {
            setProductIds([...productIds, data.product.id]);
            setHasResults(true);
            setProductName(data.product.title);
          },
        }}
        secondaryActions={[
          {
            content: "Back To Products",
            onAction: () => navigateTo(`/`),
          },
        ]}
      />
      <FooterHelp>
        Copyright ©{" "}
        <Link url="https://github.com/lazirpascual/graphql-shop">
          GraphQL-Shop
        </Link>{" "}
        2022.
      </FooterHelp>
    </Page>
  );
};
