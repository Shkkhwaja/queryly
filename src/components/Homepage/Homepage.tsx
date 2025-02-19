"use client"

import { Avatar, Input, Form, Select, Button } from "antd";
import React, { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import Header from "../Header/Header";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";


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

  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [newAvatar, setNewAvatar] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semester 1");
  const [recentQuestions, setRecentQuestions]: any = useState([]);
  const [questionForm] = Form.useForm();
  const [commentForm] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await fetch("/api/post/question");
      if (!response.ok) {
        console.log("Failed to fetch questions");
        return;
      }
      const data = await response.json();
      setRecentQuestions(data);
    } catch (error: any) {
      console.error("Error fetching questions:", error);
    }
  };



  const aiAnswer = async (postId: string, question: string) => {
    try {
      if (!postId || !question) {
        throw new Error("postId and question are required.");
      }
  
      const response = await fetch("/api/post/aianswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, question }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate AI answer.");
      }
  
      const data = await response.json();
      // console.log("AI Answer:", data);
    } catch (error: any) {
      console.error("Error generating AI answer:", error.message);
    }
  };

  

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch("/api/post/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      // console.log("data",data.data);
      
      setTimeout(() => {
        aiAnswer(data.data.id, data.data.question);
      }, 3000);
      fetchData();
 
      questionForm.resetFields();
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [handleSubmit,aiAnswer]);

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
          setNewAvatar(result.data.avatar);
          setNewName(result.data.name);
        } else {
          console.error("No token found. Please login.");
        }
      } catch (error: any) {
        console.error("An error occurred. Please try again.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleComment = async (values: any, postId: any) => {
    try {
      if (!postId) {
        throw new Error("Post ID is required to post a comment");
      }

      const post = recentQuestions.find((q: any) => q._id === postId);

      if (!post) {
        throw new Error("No matching post found");
      }

      const response = await fetch("/api/post/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: values.comment,
          postId: post._id,
          avatar: newAvatar,
          name: newName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }

      const data = await response.json();
      fetchData();
      // console.log("data : ", data);
      setNewComments((prev) => ({ ...prev, [postId]: "" })); // Reset the comment input for this post
      
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };






  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-800">
                <Toaster position="top-center" />
        
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
            <Form form={questionForm} onFinish={handleSubmit} className="space-y-4">
              <Form.Item name="question" rules={[{ required: true, message: "Please enter your question" }]}>
                <Input
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
              {recentQuestions.map((question: any) => (
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
                        src={question.author.user.avatar}
                        alt={question.author.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-base font-bold text-gray-700 dark:text-white">
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
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Comments:</h4>
                    <div className="space-y-2 bg-gray-50 p-6 rounded-lg border-2 border-gray-300 dark:bg-neutral-800 max-h-[150px] overflow-y-auto
                      [&::-webkit-scrollbar]:w-3
                      [&::-webkit-scrollbar-track]:rounded-full
                      [&::-webkit-scrollbar-track]:bg-gray-50
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

                      {question.commentsNum !== 0 ? (
                        <>
                          {question.comments.map((comment: any) => (
                            <div key={comment._id} className="flex items-center gap-4">
                              <Avatar src={comment.avatar} className="w-12 h-12" />
                              <p className="text-gray-700 dark:text-gray-300 break-words flex-1">{comment.text}</p>
                            </div>
                          ))}
                        </>
                      ) : (
                        "No comment"
                      )}
                    </div>
                    <Form
                      onFinish={(values) => handleComment(values, question._id)}
                      className="mt-4 flex gap-2"
                    >
                      <Form.Item name="comment" className="flex-1">
                        <Input
                          value={newComments[question._id] || ""}
                          onChange={(e) => setNewComments((prev) => ({ ...prev, [question._id]: e.target.value }))}
                          placeholder="Add a comment..."
                          className="px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-black placeholder:text-gray-200"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          icon={<FiSend />}
                          className="px-6 py-5 text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors dark:bg-gray-600 dark:border-none dark:hover:bg-gray-400"
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