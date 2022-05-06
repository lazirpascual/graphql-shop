import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { ProductPage } from "./components/ProductPage";
import { CartPage } from "./components/CartPage";
import { useState } from "react";

export default function App() {
  const [productIds, setProductIds] = useState([
    "gid://shopify/Product/7669003288803",
    "gid://shopify/Product/7669003256035",
  ]);

  return (
    <BrowserRouter>
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider
          config={{
            apiKey: process.env.SHOPIFY_API_KEY,
            host: new URL(location).searchParams.get("host"),
            forceRedirect: true,
          }}
        >
          <MyProvider>
            <Routes>
              <Route
                strict
                exact
                path="/"
                element={
                  <HomePage
                    productIds={productIds}
                    setProductIds={setProductIds}
                  />
                }
              />
              <Route
                strict
                exact
                path="/gid://shopify/Product/:id"
                element={
                  <ProductPage
                    productIds={productIds}
                    setProductIds={setProductIds}
                  />
                }
              />
              <Route
                strict
                exact
                path="/cart"
                element={<CartPage productIds={productIds} />}
              />
            </Routes>
          </MyProvider>
        </AppBridgeProvider>
      </PolarisProvider>
    </BrowserRouter>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
