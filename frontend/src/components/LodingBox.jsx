import React from "react";
import Spinner  from "react-bootstrap/Spinner";

export default function LodingBox() {
  return (
    <Spinner animation="border" role="status">
      <h2 className="visually-hidden">Loding...</h2>
    </Spinner>
  );
}
