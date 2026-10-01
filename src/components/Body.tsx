import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ShoppingBag,
  Heart,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag: string;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "CirclePods Pro Max ANC Headphones",
    category: "Audio",
    price: 249.99,
    originalPrice: 329.99,
    rating: 4.9,
    reviewsCount: 1240,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    tag: "BEST SELLER",
  },
  {
    id: "2",
    name: "CircleWatch Ultra Titanium Smartwatch",
    category: "Accessories",
    price: 399.0,
    originalPrice: 449.0,
    rating: 4.8,
    reviewsCount: 890,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    tag: "NEW",
  },
  {
    id: "3",
    name: "Monochrome Leather Circle Tote Bag",
    category: "Fashion",
    price: 129.5,
    originalPrice: 180.0,
    rating: 4.7,
    reviewsCount: 410,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    tag: "30% OFF",
  },
  {
    id: "4",
    name: "Minimalist Ambient RGB Desk Lamp",
    category: "Living",
    price: 79.99,
    originalPrice: 110.0,
    rating: 4.6,
    reviewsCount: 320,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80",
    tag: "TRENDING",
  },
  {
    id: "5",
    name: "Acoustic Wood Bluetooth Speaker",
    category: "Audio",
    price: 149.0,
    originalPrice: 199.0,
    rating: 4.9,
    reviewsCount: 670,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
    tag: "LIMITED",
  },
  {
    id: "6",
    name: "Ergonomic Mesh Executive Chair",
    category: "Living",
    price: 289.99,
    originalPrice: 350.0,
    rating: 4.8,
    reviewsCount: 512,
    image:
      "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=500&auto=format&fit=crop&q=80",
    tag: "POPULAR",
  },
];

const Body: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredProducts =
    selectedFilter === "All"
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === selectedFilter);

  return (
    <div className="min-h-screen bg-black text-white pb-20 select-none">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono uppercase tracking-widest">
                MINIMALIST ESSENTIALS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">
                Designed For{" "}
                <span className="text-zinc-500 font-light">Perfection.</span>
              </h1>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Curated collection of high-grade electronics, apparel, and
                lifestyle products built with precision craftsmanship.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button className="bg-white hover:bg-zinc-200 text-black font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-6 border-t border-zinc-900 grid grid-cols-3 gap-4 text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-zinc-300" />
                  <span>Global Express</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-300" />
                  <span>2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-zinc-300" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-4">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Flagship"
                className="w-full h-80 lg:h-96 object-cover rounded-xl"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-black/90 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase">
                    FLAGSHIP RELEASE
                  </div>
                  <div className="font-bold text-white text-sm">
                    CirclePods Pro Max
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    $249.99
                  </div>
                </div>
                <button className="bg-white text-black font-bold p-3 rounded-lg hover:bg-zinc-200 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              Featured Items
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Discover latest arrivals & iconic essentials
            </p>
          </div>

          <div className="flex gap-2">
            {["All", "Audio", "Fashion", "Living"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                  selectedFilter === filter
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isLiked = likedProducts.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div className="relative bg-zinc-900 h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                    {product.tag}
                  </span>
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-white text-white" : ""}`}
                    />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                      <span>{product.category}</span>
                      <div className="flex items-center gap-1 text-white font-semibold">
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-sm group-hover:text-zinc-300 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center justify-between">
                    <div>
                      <div className="text-base font-extrabold text-white">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-zinc-600 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </div>
                    </div>

                    <button className="bg-white hover:bg-zinc-200 text-black font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Body;
