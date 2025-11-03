import "./App.css";
import ProductCard from "./components/ProductCard.jsx";

function App() {
  return (
    <div className="container">
      <h2 className="title">Products List</h2>
      <div className="product-list">
        <ProductCard name="Wireless Mouse" price={25.99} inStock={true} />
        <ProductCard name="Keyboard" price={45.5} inStock={false} />
        <ProductCard name="Monitor" price={199.99} inStock={true} />
      </div>
    </div>
  );
}

export default App;




