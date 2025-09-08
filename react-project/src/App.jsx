import React from 'react';
import ProductCard from './components/ProductCard';
import './App.css';

function App() {
  const products = [
    { name: "Wireless Mouse", price: 25.99, status: "In Stock" },
    { name: "Keyboard", price: 45.50, status: "Out of Stock" },
    { name: "Monitor", price: 199.99, status: "In Stock" },
  ];

  return (
    <>
      <h1>Aryan Koundal</h1>
      <h1>Products List</h1>
      <div className="products-row">
        {products.map((product, index) => (
          <ProductCard 
            key={index} 
            name={product.name} 
            price={product.price} 
            status={product.status} 
          />
        ))}
      </div>
    </>
  );
}

export default App;
