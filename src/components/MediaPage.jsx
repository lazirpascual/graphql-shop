import { useState } from "react";

export const MediaPage = ({ images }) => {
  const [imageHovered, setImageHovered] = useState(false);

  return (
    <img
      onMouseOver={() => setImageHovered(true)}
      onMouseOut={() => setImageHovered(false)}
      alt=""
      width="400px"
      height="320px"
      style={{
        objectFit: "cover",
        objectPosition: "center",
      }}
      src={
        imageHovered
          ? images.edges[1].node.originalSrc
          : images.edges[0].node.originalSrc
      }
    />
  );
};
