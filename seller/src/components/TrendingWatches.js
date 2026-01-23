import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const TrendingWatches = ({ deals = [] }) => {
  const [selected, setSelected] = useState(null);

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full py-10 bg-white relative overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-6">Trending Watches</h2>

      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {deals.map((deal, idx) => (
            <SwiperSlide key={idx} className="flex h-full">
              <motion.div
                className="bg-black text-white rounded-2xl p-5 border border-gray-700 shadow-2xl cursor-pointer flex flex-col justify-between h-full"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 0, 0.4)" }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                viewport={{ once: true }}
                onClick={() => setSelected(deal)}
              >
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-bold">{deal.name}</h2>
                <p className="text-md text-green-400 font-semibold mt-1">
                  ₹{deal.price}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                ✖
              </button>

              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-64 object-cover rounded-lg"
              />

              <h2 className="text-2xl font-bold mt-4">{selected.name}</h2>
              <p className="text-lg text-green-600 font-semibold">
                ₹{selected.price}
              </p>
              <p className="text-gray-600 mt-2">{selected.description}</p>

              {selected.thumbnails && (
                 <div className="flex gap-2 mt-3">
                   {selected.thumbnails.map((thumb, idx) => (
                   <motion.img
                   key={idx}
                   src={thumb}
                   alt="thumb"
                   className="w-16 h-16 object-cover rounded-lg border cursor-pointer"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 500, damping: 25 }}
                   whileHover={{ scale: 1.1 }}
                   />
                 ))}
              </div>
            )}

              <div className="flex gap-4 mt-5">
                <button className="w-1/2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                  Buy Now
                </button>
                <button className="w-1/2 bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrendingWatches;
