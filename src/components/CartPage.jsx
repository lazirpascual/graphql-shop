import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Page, PageActions, Badge } from "@shopify/polaris";
import { CartProducts } from "./CartProducts";

export const CartPage = () => {
  const navigateTo = useNavigate();

  return (
    <Page
      fullwidth
      title="Cart Items"
      divider
      titleMetadata={<Badge status="success">Admin</Badge>}
    >
      <CartProducts />
      <PageActions
        primaryAction={{
          content: "Complete Order",
        }}
        secondaryActions={[
          {
            content: "Back To Products",
            onAction: () => navigateTo(`/`),
          },
        ]}
      />
    </Page>
  );
};
