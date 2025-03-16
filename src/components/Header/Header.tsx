'use client'


import { Avatar, Card } from "antd";
import React, { useState, useEffect } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import Link from "next/link";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";



const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  // Function to toggle dark/light mode
  const toggleTheme = () => {
    const html = document.documentElement;
    const newMode = isDarkMode ? "light" : "dark";

    // Update local storage and the HTML class
    localStorage.setItem("hs_theme", newMode);
    html.classList.remove(isDarkMode ? "dark" : "light");
    html.classList.add(newMode);
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAvatarUrl(result.data.avatar);
        // console.log("header : ",result.data)
        } else {
          console.error("No token found. Please login.");
        }
      } catch (error: any) {
        console.error("An error occurred. Please try again.");
      }
    };

    fetchUserDetails();
  }, [avatarUrl]);


  useEffect(() => {
    // Check the saved theme preference on component mount
    const savedTheme = localStorage.getItem("hs_theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (savedTheme === "auto" && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.add("light");
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!avatarUrl) {
          toast("Update Avatar!", { icon: "⚠️" });
        }
    }, 4000); 
  
    return () => clearTimeout(timeoutId);
  }, [avatarUrl]);
  
  
  

  return (
    <div>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
      <div className="absolute left-10 top-4">
        <Link href="/">
          <MdHome
            size={33}
            className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
          />
        </Link>
      </div>
      {/* Avatar Section */}
      <div className="absolute left-10"></div>
      <div className="absolute flex gap-[3em] right-[5em] top-4">
        <Link href="/profile">
          <Avatar
            src={avatarUrl || "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"}
            alt="avatar"
            size={35}
            className="cursor-pointer"
          />
        </Link>
        {/* Toggle Theme Button */}
        <button
          className=" p-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleTheme}
        >
          {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
      </div>
    </div>
  );
};

export default Header;
