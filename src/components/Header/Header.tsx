"use client";

import React, { useState, useEffect } from "react";
import { MdHome } from "react-icons/md";
import { MdLanguage } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { Avatar, Dropdown, Modal, Button } from "antd";
import { Form, Input } from "antd";
import { DownOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import "../../app/globals.css";
import img from "../../../public/Images/man-avatar.webp";

const Header: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [searchResults, setSearchResults] = useState<string | null>(null);

  const profileMenuItems = [
    {
      label: "Profile",
      key: "1",
    },
    {
      label: "Logout",
      key: "2",
    },
  ];

  const buttonMenuItems = [
    {
      label: "Create Post",
      key: "1",
    },
  ];

  const translateMenuItems = [
    {
      label: "Hindi",
      key: "1",
    },
    {
      label: "English",
      key: "2",
    },
    {
      label: "Marathi",
      key: "3",
    },
  ];

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
    // Check the saved theme preference on component mount
    const savedTheme = localStorage.getItem("hs_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (savedTheme === "auto" && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.add("light");
      setIsDarkMode(false);
    }
  }, []);

  const handleSearch = (values: { search: string }) => {
    setSearchText(values.search);
    setSearchResults(`Results for "${values.search}"`);
  };

  const handleClose = () => {
    setModal1Open(false);
    setSearchText("");
    setSearchResults(null);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav>
        <div className="h-[3.5em] w-full bg-white shadow-md relative dark:bg-gray-800 hidden md:block">
          <h2 className="text-[32px] md:ml-[4em] py-1 text-red-600 font-mono">
            QueryHub
          </h2>
          <ul className="flex gap-8 absolute top-3 left-[18em]">
            <li>
              <MdHome
                size={33}
                className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
              />
            </li>
            <li>
              <CiViewList
                size={33}
                className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
              />
            </li>
            <li>
              <FaRegPenToSquare
                size={30}
                className="text-gray-500 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
              />
            </li>
            <li>
              <IoMdNotificationsOutline
                size={33}
                className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
              />
            </li>
          </ul>

          {/* Search Bar */}
          <div className="absolute left-[36em] top-7 transform z-0 -translate-y-1/2 hidden md:block">
            <Form onFinish={handleSearch} layout="inline">
              <Form.Item
                name="search"
                rules={[{ required: true, message: "Please enter your search text" }]}
              >
                <div className="relative">
                  <CiSearch
                    size={25}
                    className="absolute top-1 left-[17em] z-10 text-gray-500 dark:text-white"
                  />
                  <Input
                    name="search"
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-[20em] border-gray-500 rounded-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </Form.Item>
            </Form>
          </div>

          {/* Avatar */}
          <div className="absolute top-3 right-[26em]">
            <div>
              <Avatar
                icon={
                  <Image
                    src={img}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                  />
                }
              />
            </div>
          </div>

          {/* Add Question Button */}
          <div className="absolute top-3 right-[15em]">
            <Dropdown.Button
              icon={<DownOutlined />}
              menu={{ items: buttonMenuItems }}
              className="bg-[rgba(221,49,49,0.36)] hover:bg-[rgba(221,49,49,0.2)] text-white"
            >
              Add Question
            </Dropdown.Button>
          </div>

          {/* Language select icon */}
          <div className="absolute top-3 right-[12em]">
            <div>
              <MdLanguage
                size={30}
                className="text-gray-500 cursor-pointer hover:text-red-600 dark:text-white"
              />
            </div>
          </div>

          {/* Toggle Theme Button */}
          <button
            className="absolute top-3 right-4 text-gray-600 dark:text-white border-2 px-1 hidden md:block"
            onClick={toggleTheme}
          >
            {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        <div className="h-[5.5vh] bg-red-600">
          <div className="flex text-white absolute top-2 left-1" onClick={() => setModal1Open(true)}>
            <CiSearch size={25} />
            <h2 className="text-[15px]">Search</h2>
          </div>

          <Modal
            title="Search"
            style={{ top: "20px" }}
            open={modal1Open}
            onCancel={handleClose}
            footer={null}
            width="80%"
          >
            <Form onFinish={handleSearch} layout="vertical">
              <Form.Item
                name="search"
                label="Enter search term"
                rules={[{ required: true, message: "Please enter a search term" }]}
              >
                <Input
                  placeholder="Search..."
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
              </Form.Item>

              {searchResults && <div className="my-4">{searchResults}</div>}

              <div className="flex justify-between">
                <Button
                  onClick={handleClose}
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Close
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Search
                </Button>
              </div>
            </Form>
          </Modal>

          <h2 className="text-white text-center text-[20px] py-1 font-mono">
            QueryHub
          </h2>

          <div className="text-white absolute top-2 right-2 gap-[2px] flex">
            <PlusCircleOutlined size={25} />
            <h2 className="text-[15px]">Add</h2>
          </div>

          <div className="h-[6.5vh] bg-gray-100">
            <ul className="flex px-[4px] py-1 gap-[3px] ">
              <li className="border-2 border-gray-300 p-1 px-3">
                <MdHome
                  size={33}
                  className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
                />
              </li>
              <li className="border-2 border-gray-300 p-1 px-3">
                <CiViewList
                  size={33}
                  className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
                />
              </li>
              <li className="border-2 border-gray-300 p-1 px-3">
                <FaRegPenToSquare
                  size={30}
                  className="text-gray-500 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
                />
              </li>
              <li className="border-2 border-gray-300 p-1 px-3">
                <IoMdNotificationsOutline
                  size={33}
                  className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
                />
              </li>
              <li className="border-2 border-gray-300 p-1 px-3">
                <Avatar
                  icon={
                    <Image
                      src={img}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer"
                    />
                  }
                />
              </li>
              <li className="border-2 border-gray-300 p-1 px-3">
                <MdLanguage
                  size={30}
                  className="text-gray-500 cursor-pointer hover:text-red-600 dark:text-white"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
