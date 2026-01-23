import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onFinish, fallbackMs = 4200 }) {
  const finishedRef = useRef(false);
  const timerRef = useRef(null);

  const finishOnce = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (onFinish) onFinish();
  }, [onFinish]); // ✅ stable reference

  useEffect(() => {
    timerRef.current = setTimeout(() => finishOnce(), fallbackMs);
    return () => clearTimeout(timerRef.current);
  }, [finishOnce, fallbackMs]); // ✅ dependencies included

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative w-full h-full rounded-none overflow-hidden"
      >
        <motion.video
          src="/logo.mp4"
          autoPlay
          muted
          playsInline
          onEnded={finishOnce} // ✅ no extra arrow
          loop={false}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ opacity: { duration: 3, ease: "easeInOut" } }}
          onLoadedMetadata={(e) => {
            e.target.playbackRate = 0.5;
          }}
          className="w-full h-full object-cover bg-black"
        />
        <div className="shimmer" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}