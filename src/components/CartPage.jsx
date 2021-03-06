import { useNavigate } from "react-router-dom";
import {
  Page,
  PageActions,
  Badge,
  Banner,
  FooterHelp,
  Link,
} from "@shopify/polaris";
import { CartProducts } from "./CartProducts";
import { useState } from "react";

export const CartPage = ({ productIds, setProductIds }) => {
  const navigateTo = useNavigate();
  const [hasResults, setHasResults] = useState(false);

  const bannerMarkup = hasResults && (
    <Banner
      title="Order Complete"
      status="success"
      action={{ content: "View Order" }}
      onDismiss={() => setHasResults(false)}
    >
      <p>This order was placed on {new Date().toLocaleDateString("en-CA")}.</p>
    </Banner>
  );

  return (
    <Page
      fullwidth
      title="Shopping Cart"
      divider
      titleMetadata={<Badge status="success">Admin</Badge>}
    >
      {bannerMarkup}
      <CartProducts productIds={productIds} setProductIds={setProductIds} />
      <PageActions
        primaryAction={{
          disabled: productIds.length > 0 ? false : true,
          content: "Complete Order",
          onAction: () => {
            if (confirm("Do you want to place this order?")) {
              setProductIds([]);
              setHasResults(true);
            }
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
