import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Page, PageActions, Badge } from "@shopify/polaris";
import { CartProducts } from "./CartProducts";

export const CartPage = ({ productIds, setProductIds }) => {
  const navigateTo = useNavigate();

  return (
    <Page
      fullwidth
      title="Cart Items"
      divider
      titleMetadata={<Badge status="success">Admin</Badge>}
    >
      <CartProducts productIds={productIds} setProductIds={setProductIds} />
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
