import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col justify-between">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase text-rose-500 tracking-wider">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-gray-800 mt-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">
            ₹{product.price}
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;