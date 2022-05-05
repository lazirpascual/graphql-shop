import { useQuery, gql } from "@apollo/client";
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
} from "@shopify/polaris";
import { CartMajor } from "@shopify/polaris-icons";
import { Loading } from "@shopify/app-bridge-react";
import React from "react";

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
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

export const ProductPage = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: {
      id: `gid://shopify/Product/${id}`,
    },
  });

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <Page
      fullwidth
      title="Product Info"
      divider
      titleMetadata={<Badge status="success">Admin</Badge>}
      primaryAction={{
        content: "View Cart",
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
      <Card sectioned title={data.product.title}>
        <Card.Section>
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
