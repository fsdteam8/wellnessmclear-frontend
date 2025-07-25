"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { addToCart } from "@/lib/cart-utils";
import { toggleWishlist, getWishlistItems } from "@/lib/wishlist-utils";
import { Product } from "@/types/productDataType";
// import { Product } from "@/types/productDataType";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = false,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Derived values
  const rating = product.avgRating ?? 0;
  const reviews = product.totalReviews ?? 0;
  const productId = String(product._id);

  useEffect(() => {
    const wishlist = getWishlistItems();
    const found = wishlist.some((item) => String(item._id) === productId);
    setIsInWishlist(found);
  }, [productId]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({ ...product, _id: productId });
    window.dispatchEvent(new Event("cartUpdated"));

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const newWishlistStatus = toggleWishlist({ ...product, _id: productId });
    setIsInWishlist(newWishlistStatus);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };
  console.log(product)
  return (
    <div className="w-full rounded-lg overflow-hidden transition-shadow">
      <Link href={`/product/${productId}`}>
        <div className="relative aspect-square p-4 group">
          <button
            className="absolute top-2 right-2 z-10 p-2"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`w-5 h-5 transition-all ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
            />
          </button>

          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />

          {showAddToCart && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-md flex items-center justify-center">
              <Button
                className="opacity-0 bg-[#A8C2A3] text-white text-[18px] group-hover:opacity-100 transition-opacity duration-300"
                size="sm"
                disabled={isAdding}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          )}
        </div>
      </Link>

      <div className="p-2 pt-2 mt-[20px]">
        {/* <p className="text-xs text-[#000000] text-[16px] uppercase tracking-wide mb-1">
          {product.category}
        </p> */}
        <Link
          href={`/product/${productId}`}
          className="block hover:text-gray-700 transition-colors duration-200"
        >
          <h3 className="font-medium text-[#000000] text-[20px] mb-2">
            {product.name.length > 30 ? product.name.slice(0, 25) + "..." : product.name}
          </h3>
        </Link>
       <div className="flex justify-start gap-4 items-center my-4">
         <p className="font-bold text-[#131313]  text-[40px]">
          ${product.discountedPrice}
        </p>
        <p className="line-through">${product?.actualPrice}</p>
       </div>
        <div className="flex items-center gap-2 mb-2 mt-[8px]">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>
      </div>
    </div>
  );
}
