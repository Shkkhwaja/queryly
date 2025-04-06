"use client";

import { Avatar, Input, Form, Select, Button } from "antd";
import React, { useState, useEffect } from "react";
import { FiSend, FiThumbsUp } from "react-icons/fi";
import { FaGraduationCap, FaThumbsUp } from "react-icons/fa";
import Header from "../Header/Header";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Choose a theme
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx"; // If using TypeScript
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import PageSkeleton from "../Skeleton/PageSkeleton/PageSkeleton";
import AiSkeleton from "../Skeleton/AiSkeleton/AiSkeleton";

const { Option } = Select;
const Homepage: React.FC = () => {
  type UserUpvotes = Record<string, boolean>;

  interface Question {
    _id: string;
    question: string;
    semester: string;
    author: {
      user: {
        avatar: string;
        name: string;
      };
    };
    createdAt: string;
    comments: Comment[];
    aiAnswer?: string;
    upvotes: string[]; // Array of user IDs
    upvotesCount: number;
  }
  type Comment = {
    _id: string;
    text: string;
    avatar: string;
    name: string;
  };
  const categories = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
  ];

  const [userUpvotes, setUserUpvotes] = useState<UserUpvotes>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [currentComment, setCurrentComment] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newName, setNewName] = useState("");
  const [userIdMain, setUserIdMain] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("Semester 1");
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [questionForm] = Form.useForm();
  const [commentForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchData: any = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/post/question");
      if (!response.ok) {
        console.log("Failed to fetch questions");
        return;
      }
      const data = await response.json();

      // Sorting by newest questions first (assuming `createdAt` exists)
      const sortedQuestions = data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setRecentQuestions(sortedQuestions);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Updated handleUpvote function
  const handleUpvote = async (postId: string) => {
    if (!userIdMain) {
      toast.error("Please log in to upvote.");
      return;
    }

    const userId = userIdMain;

    // Find the post and check if user already upvoted
    const post = recentQuestions.find((q: any) => q._id === postId);
    const alreadyUpvoted = post?.upvotes?.includes(userId);

    // Optimistic UI update
    setUserUpvotes((prev) => ({ ...prev, [postId]: !alreadyUpvoted }));

    setRecentQuestions((prev): any =>
      prev.map((q: any) =>
        q._id === postId
          ? {
              ...q,
              upvotesCount: alreadyUpvoted
                ? q.upvotesCount - 1
                : q.upvotesCount + 1,
              upvotes: alreadyUpvoted
                ? q.upvotes.filter((id: string) => id !== userId)
                : [...(q.upvotes || []), userId],
            }
          : q
      )
    );

    try {
      const res = await fetch("/api/post/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error("Upvote failed");
      }
    } catch (error) {
      console.error("Upvote error:", error);
      toast.error("Failed to update upvote");

      // Rollback UI on failure
      setUserUpvotes((prev) => ({
        ...prev,
        [postId]: !Boolean(alreadyUpvoted),
      }));

      setRecentQuestions((prev): any =>
        prev.map((q: any) =>
          q._id === postId
            ? {
                ...q,
                upvotesCount: alreadyUpvoted
                  ? q.upvotesCount + 1
                  : q.upvotesCount - 1,
                upvotes: alreadyUpvoted
                  ? [...(q.upvotes || []), userId]
                  : q.upvotes.filter((id: string) => id !== userId),
              }
            : q
        )
      );
    }
  };

  const aiAnswer = async (postId: string, question: string) => {
    setAiLoading(true);
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
      console.log("AI Answer Data:", data); // Debugging: Log the AI answer data

      // Update the specific question in the `recentQuestions` state
      setRecentQuestions((prevQuestions: any) => {
        const updatedQuestions = prevQuestions.map((q: any) =>
          q._id === postId
            ? { ...q, aiAnswer: data.data } // Access `data.data` instead of `data.answer`
            : q
        );
        console.log("Updated Questions:", updatedQuestions); // Debugging: Log the updated state
        return updatedQuestions;
      });
    } catch (error: any) {
      console.error("Error generating AI answer:", error);
    } finally {
      setAiLoading(false);
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

      // Create a new question object locally
      const newQuestion = {
        _id: data.data.id, // Assuming the API returns the ID of the new question
        question: values.question,
        semester: values.category,
        author: {
          user: {
            avatar: newAvatar,
            name: newName,
          },
        },
        createdAt: new Date().toISOString(),
        comments: [],
        upvotes: [],
        upvotesCount: 0,
      };

      // Update the `recentQuestions` state locally
      setRecentQuestions((prevQuestions: any) => [
        newQuestion,
        ...prevQuestions,
      ]);

      // Generate AI answer after a delay
      aiAnswer(data.data.id, values.question);

      // Reset the form fields
      questionForm.resetFields();
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          setUserIdMain(result.data._id);
        } else {
          console.error("No token found. Please login.");
        }
      } catch (error: any) {
        console.error("An error occurred. Please try again.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleComment = async (values: { comment: string }, postId: string) => {
    if (!postId) {
      toast.error("Post ID is required");
      return;
    }

    const post = recentQuestions.find((q: Question) => q._id === postId);
    if (!post) {
      toast.error("No matching post found");
      return;
    }

    const tempId = Date.now().toString();

    // Optimistic UI update
    const tempComment: Comment = {
      _id: tempId,
      text: values.comment,
      avatar: newAvatar,
      name: newName,
    };

    setRecentQuestions((prev: Question[]) =>
      prev.map((q) =>
        q._id === postId
          ? { ...q, comments: [...(q.comments ?? []), tempComment] }
          : q
      )
    );

    try {
      const response = await fetch("/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: values.comment,
          postId,
          avatar: newAvatar,
          name: newName,
        }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const data = await response.json();
      console.log("Comment added:", data);

      const savedComment: Comment = {
        _id: data._id, // Ensure the API returns a valid comment ID
        text: values.comment,
        avatar: newAvatar,
        name: newName,
      };

      // Update state with the saved comment
      setRecentQuestions((prev: Question[]) =>
        prev.map((q) =>
          q._id === postId
            ? { ...q, comments: [...(q.comments ?? []), savedComment] }
            : q
        )
      );

      setNewComments((prev) => ({ ...prev, [postId]: "" })); // Reset input field
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
  };

  const formatText = (text: string) => {
    if (!text) return "";

    return (
      text
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-extrabold">$1</h1>')

        // Code Blocks
        .replace(
          /```([\s\S]+?)```/g,
          `<pre class="rounded-lg overflow-x-auto p-3 bg-gray-900 text-white"><code class="language-js">$1</code></pre>`
        )

        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-gray-200 text-red-500 p-1 rounded">$1</code>'
        )

        // Bold Text
        .replace(/\*\*(.*?)\*\*/g, '<span class="font-extrabold">$1</span>')
        .replace(/\*(.*?)\*/g, '<span class="font-bold">$1</span>')

        // Blockquotes
        .replace(
          /^> (.*$)/gm,
          '<blockquote class="border-l-4 border-gray-500 pl-4 italic">$1</blockquote>'
        )

        // Lists
        .replace(/^[-*] (.*$)/gm, '<li class="list-disc ml-6">$1</li>')

        // Links
        .replace(
          /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g,
          '<a href="$2" class="text-blue-500 underline" target="_blank">$1</a>'
        )

        // Tables (Handle Markdown tables)
        .replace(
          /\|(.+?)\|\n\|(?:-+\|)+\n((?:\|.+?\|\n?)+)/g,
          (match, headers, rows) => {
            const headerHtml = `<tr>${(headers as string)
              .split("|")
              .map((h) => `<th class="border px-4 py-2">${h.trim()}</th>`)
              .join("")}</tr>`;

            const rowsHtml = (rows as string)
              .trim()
              .split("\n")
              .map(
                (row) =>
                  `<tr>${row
                    .split("|")
                    .map(
                      (cell) =>
                        `<td class="border px-4 py-2">${cell.trim()}</td>`
                    )
                    .join("")}</tr>`
              )
              .join("");

            return `<table class="table-auto border-collapse border border-gray-300 w-full text-left">${headerHtml}${rowsHtml}</table>`;
          }
        )

        // Line Breaks
        .replace(/\n/g, "<br>")
    );
  };

  useEffect(() => {
    Prism.highlightAll();
  }, []);

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
            <Form
              form={questionForm}
              onFinish={handleSubmit}
              className="space-y-4"
            >
              <Form.Item
                name="question"
                rules={[
                  { required: true, message: "Please enter your question" },
                ]}
              >
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

          {loading ? (
            <>
              <PageSkeleton />
              <PageSkeleton />
              <PageSkeleton />
            </>
          ) : (
            <div className="w-[90vw] mx-auto">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Questions
              </h2>
              <div className="space-y-6">
                {recentQuestions.map((question: any) => (
                  <div
                    key={question._id}
                    className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-neutral-800"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm mb-3">
                      <img
                        src={question.author.user.avatar}
                        alt={question.author.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {question.author.user.name}
                        </p>
                        <p className="text-xs">
                          {new Date(question.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Question */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      {question.question}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                        {question.semester}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {question.comments.length} Comments
                      </span>
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(question._id)}
                        className="flex items-center gap-1 text-sm hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                      >
                        {question.upvotes?.includes(userIdMain) ? (
                          <FaThumbsUp className="text-base text-blue-500 dark:text-blue-400" />
                        ) : (
                          <FiThumbsUp className="text-base text-gray-500 dark:text-gray-400" />
                        )}
                        <span>{question.upvotesCount || 0}</span>
                      </button>
                    </div>

                    {/* AI Answer - More Visible */}
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      AI Answer:
                    </h4>
                    {aiLoading ? (
                      <AiSkeleton />
                    ) : (
                      <div className="relative bg-transparent dark:bg-blue-900/30 p-5 rounded-xl dark:border-blue-500 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-200 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-blue-900 rounded-sm shadow-sm ">
                        <p
                          className="text-gray-900 dark:text-gray-200 font-medium tracking-wide leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatText(question?.aiAnswer),
                          }}
                        ></p>
                      </div>
                    )}

                    {/* Comments Section */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        Comments:
                      </h4>
                      <div className="space-y-3 bg-transparent max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-neutral-700">
                        {question?.comments?.length > 0 ? (
                          question.comments.map(
                            (comment: any) =>
                              comment?._id && (
                                <div
                                  key={comment._id}
                                  className="flex items-start gap-3"
                                >
                                  <img
                                    src={
                                      comment?.avatar ||
                                      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
                                    }
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <p className="text-gray-700 dark:text-gray-300 text-[15px] flex-1 bg-gray-100 dark:bg-neutral-900 p-3 rounded-lg">
                                    {comment?.text || "No content available"}
                                  </p>
                                </div>
                              )
                          )
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No comments yet.
                          </p>
                        )}
                      </div>

                      {/* Comment Input */}
                      <Form
                        onFinish={(values) =>
                          handleComment(values, question?._id)
                        }
                        className="mt-4 flex gap-2"
                      >
                        <Form.Item name="comment" className="flex-1">
                          <Input
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
          )}
        </div>
      </div>
    </>
  );
};

export default Homepage;
