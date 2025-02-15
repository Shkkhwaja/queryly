"use client";

import { Avatar, Input, Form, Select, Button } from "antd";
import React, { useState,useEffect } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import Link from "next/link";
import Header from "../Header/Header";

const { Option } = Select;


const Homepage: React.FC = () => {
  const categories = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];

  const [question, setQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semester 1");
  const [recentQuestions, setRecentQuestions]: any = useState([]);

const fetchData = async () => {
  try {
    const response = await fetch("/api/post/question")
  if(!response.ok){
    console.log("Failed  to fetch questions")
    return; 
  }
  const data = await response.json()
  setRecentQuestions(data) 
  } catch (error:any) {
    console.error("Error fetching questions:", error);
  }
}

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch("/api/post/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: values.question,
          semester: values.category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post question");
      }

      const data = await response.json();
      console.log("Question posted:", data);
      setQuestion(""); // Clear input field
      fetchData()
      
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  useEffect(() => {
    console.log("data ",recentQuestions)
    fetchData(); 
  }, []);

  const handleComment = async (values: any) => {
    try {
      // Ensure you are accessing the correct question ID
    const postId = recentQuestions.length > 0 ? recentQuestions[0]._id : null; // Change index as needed
      console.log("postId",postId);
      
    if (!postId) {
      throw new Error("No valid post ID found");
    }
      const response = await fetch("/api/post/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: values.comment,
          postId: postId,
          avatar: recentQuestions[0].avatar,
          name: recentQuestions[0].name,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to post comment");
      }
  
      const data = await response.json(); 
      console.log("Comment posted: ", data);
    } catch (error) {
      console.error("Error posting comment: ", error);
    }
  };


  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-800">
        <div className="container mx-auto px-4 pt-20 pb-12 dark:bg-neutral-800">
          <div className="text-center mb-16">
            <FaGraduationCap className="text-6xl text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Queryly
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your AI-powered Q&A platform for TMV College. Get instant answers
              to your questions.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-20">
          <Form onFinish={handleSubmit} className="space-y-4">
              <Form.Item name="question" rules={[{ required: true, message: "Please enter your question" }]}> 
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about TMV College..."
                  className="w-full px-6 py-4 text-lg border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-black dark:!bg-gray-800 dark:!text-white placeholder-gray-400"

                />
              </Form.Item>

              <div className="flex gap-4">
                <Form.Item name="category" initialValue={selectedCategory}>
                  <Select onChange={(value) => setSelectedCategory(value)}>
                    {categories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<FiSend />}>
                    Submit Question
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>

          <div className="w-[90vw] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {recentQuestions.map((question : any) => (
                <div
                  key={question._id}
                  className="bg-white w-full p-6 rounded-lg shadow-md border border-gray-200 dark:bg-neutral-700 dark:text-white "
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                    {question.question}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={question.author.avatar}
                        alt={question.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-base font-bold  text-gray-700 dark:text-white">
                        {question.author.user.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {question.commentsNum} comments
                    </span>
                  </div>
                  <div className="mt-4 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold capitalize">
                      {question.semester}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      AI Answer:
                    </h4>
                  <div
                    className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300 dark:bg-neutral-800 max-h-[200px] overflow-y-auto
  [&::-webkit-scrollbar]:w-3
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                  >
                    
                    <p className="text-gray-700 dark:text-gray-300">
                      {question.aiAnswer}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Comments:
                    </h4>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg border-2 border-gray-300 dark:bg-neutral-800 max-h-[100px] overflow-y-auto
  [&::-webkit-scrollbar]:w-3
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
    {question.commentsNum !== 0 ? 
    <>
    {question.comments.map((comment :any) => (
                        <div key={comment._id} className="flex items-center gap-3">
                          <Avatar src={question.author.avatar} />
                          <p className="text-gray-700 dark:text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                      ))} 
                      </>
                      : "No comment"}
                      
                    </div>
                    <Form onFinish={handleComment} className="mt-4 flex gap-2">
              <Form.Item name="comment" className="flex-1" rules={[{ required: true, message: "Please enter your comment" }]} >
                <Input
                  placeholder="Add a comment..."
                  className="px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-black placeholder:text-gray-200"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  icon={<FiSend />}
                  className="px-6 py-5  text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors dark:bg-gray-600 dark:border-none dark:hover:bg-gray-400"
                >
                  Send
                </Button>
              </Form.Item>
            </Form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
