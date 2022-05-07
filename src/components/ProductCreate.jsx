import { Modal, ChoiceList, FormLayout, TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";

export const ProductCreate = ({ active, handleChange }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(["active"]);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleTitleChange = useCallback((value) => setTitle(value), []);
  const handleDescChange = useCallback((value) => setDescription(value), []);
  const handleStatusChange = useCallback((value) => setStatus(value), []);
  const handleImageChange = useCallback((value) => setImage(value), []);
  const handlePriceChange = useCallback((value) => setPrice(value), []);
  const handleQuantityChange = useCallback((value) => setQuantity(value), []);

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
          onAction: handleChange,
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
                { label: "Active", value: "active" },
                { label: "Draft", value: "draft" },
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
              label="Product Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="Inventory count"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </div>
  );
};
