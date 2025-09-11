// src/components/ProductCard.jsx
import React from 'react';

function ProductCard({ name, price, status }) {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>Price: ${price}</p>
      <p>Status: {status}</p>
    </div>
  );
}

export default ProductCard;
