import React from 'react';
import './ProductCard.css';

function ProductCard({ name, price, inStock }) {
  return (
    <div>

      <div className="product-card">
        <h3 className="product-name">{name}</h3>
        <p className="product-price">Price: ${price}</p>
        <p className={inStock ? 'in-stock' : 'out-of-stock'}>
          Status: {inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;

