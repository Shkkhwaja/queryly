"use client";

import { Avatar, Card } from "antd";
import React, { useState } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import Link from "next/link";
import Header from "../Header/Header";

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
  const [recentQuestions, setRecentQuestions] = useState([
    {
      id: 1,
      title: "What are the library hours during finals week?",
      description: "I need to plan my study schedule for the upcoming finals.",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      },
      comments: [
        { user: "John Doe", text: "This is the first comment." },
        { user: "Jane Smith", text: "This is the second comment." },
      ],
      commentsNum: 2,
      tag: "Semester 1",
      aiAnswer: "The library is open from 8 AM to 10 PM during finals week.",
    },
    {
      id: 2,
      title: "What are the library hours during finals week?",
      description: "I need to plan my study schedule for the upcoming finals.",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      },
      comments: [
        { user: "John Doe", text: "This is the first comment." },
        { user: "Jane Smith", text: "This is the second comment." },
      ],
      commentsNum: 2,
      tag: "Semester 1",
      aiAnswer: "The library is open from 8 AM to 10 PM during finals week.",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 10) {
      alert("Question must be at least 10 characters long");
      return;
    }
    console.log({ question, selectedCategory });
    setQuestion("");
  };

  const handleCommentSubmit = (questionId: number, commentText: string) => {
    if (commentText.trim().length === 0) return;

    setRecentQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              comments: [
                ...q.comments,
                { user: "Current User", text: commentText },
              ],
              commentsNum: q.commentsNum + 1,
            }
          : q
      )
    );
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about TMV College..."
                  className="w-full px-6 py-4 text-lg border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <FiSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>

              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Submit Question</span>
                  <FiSend />
                </button>
              </div>
            </form>
          </div>

          <div className="w-[90vw] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {recentQuestions.map((question, index) => (
                <div
                  key={index}
                  className="bg-white w-full p-6 rounded-lg shadow-md border border-gray-200 dark:bg-neutral-700 dark:text-white"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
                    {question.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={question.author.avatar}
                        alt={question.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-white">
                        {question.author.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {question.commentsNum} comments
                    </span>
                  </div>
                  <div className="mt-4 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                      {question.tag}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-neutral-800">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      AI Answer:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {question.aiAnswer}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      Comments:
                    </h4>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-neutral-800">
                      {question.comments.map((comment, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar src={question.author.avatar} />
                          <p className="text-gray-700 dark:text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                    <form className="mt-4 flex gap-2">
                      <input
                        type="text"
                        name="comment"
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send
                      </button>
                    </form>
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
