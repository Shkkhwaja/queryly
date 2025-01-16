"use client";
import { Avatar, Card } from "antd";
import img from "../../../public/Images/man-avatar.webp";
import demo from "../../../public/demo.png";
import Image from "next/image";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { BiUpvote } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";

import { useState } from "react";

const { Meta } = Card;

const Homepage: React.FC = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };


// Sample comments data
  const comments = [
    {
      name: "John Doe",
      date: "April 17, 2023",
      comment:
        "This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elitThis is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elitThis is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      name: "Jane Smith",
      date: "April 16, 2023",
      comment:
        "I agree with John. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      name: "Bob Johnson",
      date: "April 15, 2023",
      comment:
        "I have a different opinion. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];


  return (
    <div>
      <div className="flex justify-center align-center ">
        <form className="w-[60vw] rounded-sm p-4">
          <label htmlFor="chat" className="sr-only">
            Ask Question...
          </label>
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            {/* Avatar */}
            <div className="relative">
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

            <textarea
              id="chat"
              className="h-[7vh] resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ask Question..."
            ></textarea>
            <button
              type="submit"
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
            >
              <svg
                className="w-5 h-5 rotate-90 rtl:-rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>

      {/* card component */}
      <div className="flex justify-center py-2">
        <Card
          style={{ width: 750 }}
          cover={
            <div className="h-auto w-auto py-2 align-center justify-items-center">
            <Image
              alt="example"
              src={demo}
              className="rounded-lg"
            />
            </div>
          }
          className=" bg-slate-100 dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg"
          actions={[
            <div>
            <div className="flex gap-8 px-5 h-auto ">
              <div className=" flex gap-3 h-8 w-[auto] px-2 mt-3  border-2 bg-orange-200  rounded-xl border-gray-500  ">
                <BiUpvote
                  size={25}
                  className="text-black hover:text-purple-500"
                />
                <h2 className=" text-[18px] text-black font-bold">5</h2>
              </div>
              <form className="w-[60vw] rounded-sm ">
                <label htmlFor="chat" className="sr-only">
                  Your message
                </label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-orange-200 ">
                  {/* Avatar */}
                  <div className="relative">
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

                  <textarea
                    id="chat"
                    className="h-[5vh] resize-none block mx-4 p-1.5 px-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Comments..."
                  ></textarea>
                  <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5 rotate-90 rtl:-rotate-90"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </div>
              </form>
      </div>



{/* Comments Section */}
<div className="mt-2 p-6">
  {comments.map((comment, index) => (
    <div
      key={index}
      className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow mb-4"
    >
      {/* Avatar, Name, and Date */}
      <div className="flex items-center mb-2">
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
        <div className="ml-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {comment.name}
          </h3>
          <p className="text-sm text-gray-500">{comment.date}</p>
        </div>
      </div>
      {/* Comment Content */}
      <p className="bg-gray-200 rounded-lg p-2 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-[15px] text-start">{comment.comment}</p>
    </div>
  ))}
</div>






        </div>
          ]}
        >
          <div className="flex gap-1">
            <Avatar
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
              className="dark:bg-gray-700"
            />
            <h2 className="text-[16px] pt-1 font-bold text-fuchsia-600">
              Khwaja Shaikh
            </h2>
          </div>

          <div className="flex items-start mt-4">
            <div className="ml-10 bg-slate-200 p-4 rounded-lg text-gray-900 dark:text-white dark:bg-gray-900">
              <h3 className="text-lg font-semibold">Card title</h3>
              <h3 className="text-lg font-normal bg-[#3a30301f] dark:bg-gray-950 text-center p-1 rounded-lg text-gray-800 dark:text-gray-300">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </h3>
              <div className="mt-2">
                {showFullDescription ? (
                  <>
                    <p className="dark:text-gray-300">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                      amet cumque inventore, est, quos ipsum sed qui harum,
                      laboriosam quod nam laudantium natus aperiam quasi
                      distinctio labore! Maiores tempora sunt, assumenda velit
                      inventore quam voluptatem suscipit aliquid corporis
                      repellat beatae deserunt ex dolore atque quasi modi quia
                      voluptates repellendus nesciunt.
                    </p>
                    <p className="dark:text-gray-300">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Adipisci ullam quo consequuntur. Doloremque, non iste
                      eaque magni consequuntur ratione aliquid impedit quos
                      asperiores maxime iusto a expedita quis. In aut ipsa
                      itaque. Cumque minima cupiditate rerum sunt. Harum placeat
                      at numquam, repellat optio ab? Vero beatae consectetur
                      ipsa delectus itaque?.
                    </p>
                    <button
                      onClick={toggleDescription}
                      className="text-blue-500 dark:text-blue-400"
                    >
                      Read less
                    </button>
                  </>
                ) : (
                  <>
                    <p className="dark:text-gray-300">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                      amet cumque inventore, est, quos ipsum sed qui harum,
                      laboriosam quod nam laudantium natus aperiam quasi
                      distinctio labore! Maiores tempora sunt, assumenda velit
                      inventore quam voluptatem suscipit aliquid corporis
                      repellat beatae deserunt ex dolore atque quasi modi quia
                      voluptates repellendus nesciunt.
                    </p>
                    <button
                      onClick={toggleDescription}
                      className="text-blue-500 dark:text-blue-400"
                    >
                      Read more
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>







      </div>
    </div>
  );
};

export default Homepage;
