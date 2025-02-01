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
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { MdLightMode, MdDarkMode } from "react-icons/md";
import Link from "next/link"

const HeaderTwo: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [openResponsive, setOpenResponsive] = useState(false);


  const onChange = (key: string) => {
    console.log(key);
  };
  
  const [uploadedImage, setUploadedImage] = useState<any>(null);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl  = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };


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
          <Link href="/"><h2 className="text-[32px] md:ml-[4em] py-1 text-red-600 font-mono">
            Queryly
          </h2></Link>
          <ul className="flex gap-8 absolute top-3 left-[18em]">
          <Link href="/"> <li>
              <MdHome
                size={33}
                className="text-gray-600 cursor-pointer hover:text-red-600 dark:text-white dark:hover:text-red-600"
              />
            </li></Link>
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
                name="Search"

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
            <Link href="/profile"><Avatar
                            icon={
                  <Image
                    src={img}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                  /> 
                }
              /></Link>
            </div>
          </div>

          {/* Add Question Button */}
          <div className="absolute top-3 right-[15em]">
            <Dropdown.Button
              icon={<DownOutlined />}
              menu={{ items: buttonMenuItems }}
              className="bg-[rgba(221,49,49,0.36)] hover:bg-[rgba(221,49,49,0.2)] text-white"
              onClick={() => setOpenResponsive(true)}
            >
              Add Question
            </Dropdown.Button>
          </div>

          <Modal
      centered
      open={openResponsive}
      onCancel={() => setOpenResponsive(false)}
      style={{ top: -15 }}
      width={750}
      footer={null}
    >
      <div style={{ height: "60vh", padding: "10px" }}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: <span>Add Question</span>,
              children: (
                <>
                  <div
                    style={{
                      backgroundColor: "#e6f7ff",
                      color: "#0050b3",
                      padding: "10px",
                      marginBottom: "15px",
                      borderRadius: "0px",
                      fontSize: "14px",
                    }}
                  >
                    <strong>Tips on getting good answers quickly</strong>
                    <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
                      <li>Make sure your question has not been asked already</li>
                      <li>Keep your question short and to the point</li>
                      <li>Double-check grammar and spelling</li>
                    </ul>
                  </div>
                  <Form layout="vertical">
                    <Form.Item
                      name="questionTitle"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your question",
                        },
                      ]}
                    >
                      <Input
                        placeholder='Start your question with "What", "How", "Why", etc'
                        style={{
                          border: "none",
                          borderBottom: "1px solid #ccc",
                          fontSize: "20px",
                          fontFamily: "monospace",
                        }}
                        className="custom-input"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                      >
                        Create Question
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              ),
            },
            {
              key: "2",
              label: <span>Create a Post</span>,
              children: (
                <>
                  <div className="flex gap-2 my-5">
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
                    <span className="text-[18px] ">Khwaja shaikh</span>
                  </div>
                  <Form layout="vertical">
                    <Form.Item
                      name="postTitle"
                      rules={[
                        {
                          required: true,
                          message: "Please enter a post title",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter post title"
                        style={{
                          border: "none",
                          borderBottom: "1px solid #ccc",
                          fontSize: "20px",
                          fontFamily: "monospace",
                        }}
                        className="custom-input"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Input
                        type="file"
                        // accept="image/*"
                        // onChange={handleImageUpload}
                        style={{
                          border: "none",
                          fontSize: "16px",
                          marginBottom: "10px",
                        }}
                      />
                    </Form.Item>
                    {/* {uploadedImage && (
                      <div
                        style={{
                          marginBottom: "10px",
                          textAlign: "center",
                        }}
                      >
                        <Image
                          src={uploadedImage}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100px",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    )} */}
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                      >
                        Create Post
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              ),
            },
          ]}
        />
      </div>
    </Modal>





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
            className="absolute top-2 right-[8em] p-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
            onClick={toggleTheme}
          >
                {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        <div className="h-[5.5vh] bg-red-600">
          <div
            className="flex text-white absolute top-2 left-1"
            onClick={() => setModal1Open(true)}
          >
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
                rules={[
                  { required: true, message: "Please enter a search term" },
                ]}
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

          <div className="text-white absolute top-2 right-2 gap-[2px] flex"
                        onClick={() => setOpenResponsive(true)}

          >
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

export default HeaderTwo;
