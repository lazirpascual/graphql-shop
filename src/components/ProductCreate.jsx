import {
  Modal,
  ChoiceList,
  FormLayout,
  TextField,
  Banner,
} from "@shopify/polaris";
import { Loading } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT, GET_ALL_PRODUCTS } from "../queries/graphql";

export const ProductCreate = ({
  active,
  handleChange,
  setHasResults,
  setBannerContent,
}) => {
  // state to keep track of values in text field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(["ACTIVE"]);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  // function for handling change in text field
  const handleTitleChange = useCallback((value) => setTitle(value), []);
  const handleDescChange = useCallback((value) => setDescription(value), []);
  const handleStatusChange = useCallback((value) => setStatus(value), []);
  const handleImageChange = useCallback((value) => setImage(value), []);
  const handlePriceChange = useCallback((value) => setPrice(value), []);
  const handleTypeChange = useCallback((value) => setType(value), []);

  // GraphQL mutation state
  const [createProduct, { error, loading, data }] = useMutation(
    CREATE_PRODUCT,
    {
      refetchQueries: [{ query: GET_ALL_PRODUCTS }],
    }
  );

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  const activator = (
    <button style={{ display: "none" }} onClick={handleChange}>
      Create Product
    </button>
  );

  return (
    <div style={{ height: "500px" }}>
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Create a New Product"
        primaryAction={{
          content: "Create",
          onAction: async () => {
            await createProduct({
              variables: {
                input: {
                  title,
                  descriptionHtml: description,
                  productType: type,
                  variants: {
                    price,
                  },
                },
              },
            });

            handleChange();
            setBannerContent(`Product '${title}' has been created!`);
            setHasResults(true);
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Name of the product"
              autoComplete="off"
            />
            <TextField
              label="Description"
              value={description}
              onChange={handleDescChange}
              placeholder="Description of the product"
              multiline={4}
            />
            <ChoiceList
              title="Product Status"
              selected={status}
              onChange={handleStatusChange}
              choices={[
                { label: "Active", value: "ACTIVE" },
                { label: "Draft", value: "DRAFT" },
              ]}
            />
            <TextField
              label="Image"
              value={image}
              onChange={handleImageChange}
              placeholder="URL of the image"
            />
            <TextField
              label="Price"
              value={price}
              onChange={handlePriceChange}
              placeholder="Price of the product"
            />
            <TextField
              label="Product Type"
              value={type}
              onChange={handleTypeChange}
              placeholder="What type of product is it?"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </div>
  );
};
