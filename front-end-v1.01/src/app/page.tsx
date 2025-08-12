"use client";
import { FC } from "react";
import PNGBlobFromImage from "@/components/PNGBlobFromImage";
import { Canvas } from "@react-three/fiber";

const Home: FC = () => {
  return (
    <div
      className="relative min-h-screen text-white overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Three.js Canvas with built-in background glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ alpha: false, antialias: true }}
          style={{ background: "#0d0d0d" }}
        >
          <ambientLight intensity={0.02} />
          <group position={[0, 0, 0]}>
            <PNGBlobFromImage
              src="/blobCluster.png"
              mode="alpha"
              size={13}
              rimGlow={2.2}
              threshold={0.1}
              pulseAmp={0.08}
            />
          </group>
        </Canvas>
      </div>

      {/* Foreground Content */}
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        {/* Top section */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-snug">
            Manage Your Sales, Purchases & Stock All in One Place
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Al Nada Scientific Office’s internal platform helps you track
            products, monitor stock levels, record purchases and sales, and
            streamline every step of your operations – anytime, anywhere.
          </p>
          <button className="mt-8 px-6 py-3 bg-purple-600 rounded-md text-white font-medium hover:bg-purple-700 transition">
            Start Managing
          </button>
        </div>

        {/* Bottom Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Product Inventory",
              desc: "View, update, and control all items in stock with real-time data.",
            },
            {
              title: "Sales Tracking",
              desc: "Log and monitor all outgoing sales with accurate records.",
            },
            {
              title: "Purchase Management",
              desc: "Record supplier orders and keep track of incoming products.",
            },
            {
              title: "Reports & Analytics",
              desc: "Generate detailed summaries to make informed business decisions.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-purple-400 transition"
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* (Removed standalone PNG demo section; background now uses PNG) */}
      </div>
    </div>
  );
};

export default Home;
