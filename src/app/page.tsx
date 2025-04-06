"use client";
import Homepage from "@/components/Homepage/Homepage";
import Image from "next/image";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="dark:bg-gray-950 h-auto w-full">
      <Homepage />
    </div>
  );
};

export default Home;
