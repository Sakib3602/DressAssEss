"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

// প্রোডাক্টের টাইপ ডিফাইন করা হলো
type Product = {
  id: number;
  category: string;
  title: string;
  oldPrice: string;
  price: string;
  discount: string;
  image: string;
};

// আপনার দেওয়া নতুন ছবিগুলো দিয়ে আপডেট করা ১০টি প্রোডাক্টের ডাটাবেস
const PRODUCTS: Product[] = [
  // Top Carousel Items (1-5)
  {
    id: 1,
    category: "Bikini Bottom",
    title: "Escape Bikini Top",
    oldPrice: "$120.00",
    price: "$100.00",
    discount: "17% OFF",
    image: "https://images.unsplash.com/photo-1694290340663-65804773ce7a?q=80&w=991&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    category: "Swimwear",
    title: "One-Piece Swimsuit",
    oldPrice: "$100.00",
    price: "$90.00",
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1664158162601-79d988a17334?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    category: "Bikini Bottom",
    title: "Salty Bikini Bottom",
    oldPrice: "$150.00",
    price: "$120.00",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1695457175343-e26f38f8edcd?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    category: "Lingerie",
    title: "Midnight Silk Set",
    oldPrice: "$85.00",
    price: "$65.00",
    discount: "25% OFF",
    image: "https://images.unsplash.com/photo-1620228829896-c42a7c99fd3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    category: "Beachwear",
    title: "Summer Wrap Top",
    oldPrice: "$70.00",
    price: "$55.00",
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1599839770015-53df36f312a8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // Bottom Carousel Items (6-10)
  {
    id: 6,
    category: "Bralette",
    title: "Ribbed Lounge Bralette",
    oldPrice: "$45.00",
    price: "$35.00",
    discount: "22% OFF",
    image: "https://images.unsplash.com/photo-1572358764342-612d02e2d2d2?q=80&w=990&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    category: "Swimwear",
    title: "High-Waist Bikini Bottom",
    oldPrice: "$60.00",
    price: "$45.00",
    discount: "25% OFF",
    image: "https://images.unsplash.com/photo-1572109754335-3807540beef2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    category: "Lingerie",
    title: "Lace Trim Cami",
    oldPrice: "$50.00",
    price: "$40.00",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1594631770635-f2915410b410?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    category: "Bikini Top",
    title: "Classic Triangle Top",
    oldPrice: "$75.00",
    price: "$55.00",
    discount: "26% OFF",
    image: "https://images.unsplash.com/photo-1585832606123-9b1a92ca8b8f?q=80&w=703&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 10,
    category: "Panties",
    title: "Seamless Thong Set",
    oldPrice: "$40.00",
    price: "$30.00",
    discount: "25% OFF",
    image: "https://images.unsplash.com/photo-1657753023885-7e30e39bf039?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// ProductCard এর প্রপস টাইপ
interface ProductCardProps {
  product: Product;
}

// সিঙ্গেল প্রোডাক্ট কার্ড কম্পোনেন্ট
const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-3 group cursor-pointer w-[280px] md:w-[320px] flex-shrink-0">
      {/* Image & Badges Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F1EFEA]">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />

        {/* Discount Badge (Top Left) */}
        {product.discount && (
          <div className="absolute top-4 left-4 bg-[#1E1E1E] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white z-10">
            {product.discount}
          </div>
        )}

        {/* Love Icon (Bottom Right) */}
        <button
          className="absolute bottom-4 right-4 bg-white p-2.5 shadow-sm transition-all hover:bg-gray-50 active:scale-95 z-10"
          aria-label="Add to Wishlist"
        >
          <Heart size={18} strokeWidth={1.5} className="text-gray-700" />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 mt-1">
        <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium">
          {product.category}
        </span>
        <h3 className="text-[15px] text-gray-800 font-medium">{product.title}</h3>
        <div className="flex items-center gap-2 text-[14px]">
          <s className="text-gray-400">{product.oldPrice}</s>
          <span className="text-gray-900 font-medium">{product.price}</span>
        </div>
      </div>
    </div>
  );
};

// AutoScrollCarousel এর প্রপস টাইপ
interface AutoScrollCarouselProps {
  items: Product[];
  reverse?: boolean;
}

// অটো-স্ক্রলিং ক্যারোসেল কম্পোনেন্ট (হাত দিয়ে সরানোও যাবে)
const AutoScrollCarousel = ({ items, reverse = false }: AutoScrollCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    
    // উল্টো দিকের জন্য শুরুতে স্ক্রল পজিশন সেট করা
    if (reverse) {
      el.scrollLeft = el.scrollWidth / 2;
    }

    const scroll = () => {
      if (!isInteracting) {
        if (reverse) {
          el.scrollLeft -= 1; // স্পিড কন্ট্রোল
          if (el.scrollLeft <= 0) {
            el.scrollLeft = el.scrollWidth / 2;
          }
        } else {
          el.scrollLeft += 1;
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft = 0;
          }
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isInteracting, reverse]);

  // ইনফিনিট লুপের জন্য আইটেমগুলোকে কয়েকবার কপি করে নেওয়া হয়েছে
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto py-4 px-6 md:px-12 touch-pan-x hide-scrollbar"
        // মাউস বা হাত দিলে অটো-স্ক্রল থেমে যাবে, তখন ইউজার নিজে সরাতে পারবে
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
      >
        {duplicatedItems.map((item, index) => (
          <ProductCard key={`${item.id}-${index}`} product={item} />
        ))}
      </div>
    </>
  );
};

// মূল Best Seller সেকশন
export default function BestSeller() {
  // প্রথম ৫টি প্রোডাক্ট ওপরের ক্যারোসেলের জন্য
  const topRowProducts = PRODUCTS.slice(0, 5);
  // শেষের ৫টি প্রোডাক্ট নিচের ক্যারোসেলের জন্য
  const bottomRowProducts = PRODUCTS.slice(5, 10);

  return (
    <section className="w-full bg-white py-16 md:py-24 overflow-hidden">
      {/* গ্লোবাল স্টাইল পল্যুশন রোধ করতে স্পেসিফিক ক্লাস যুক্ত করা হলো */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-5xl font-medium text-gray-900 mb-3">
          -- Best Sellers <span className="italic">--</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base tracking-wide">
          Our most loved styles, chosen by you.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:gap-12">
        {/* Row 1: Left to Right scroll (Items 1-5) */}
        <AutoScrollCarousel items={topRowProducts} reverse={false} />
        
        {/* Row 2: Right to Left scroll (Items 6-10) */}
        <AutoScrollCarousel items={bottomRowProducts} reverse={true} />
      </div>
    </section>
  );
}