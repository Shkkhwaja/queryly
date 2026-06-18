"use client";

import { Avatar, Input, Form, Select, Button } from "antd";
import React, { useState, useEffect } from "react";
import { FiSend, FiThumbsUp, FiSearch } from "react-icons/fi";
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
import Footer from "../Footer/Footer";

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
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(10);
  const postsPerLoad = 10;

  const fetchData: any = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/post/question");
      if (!response.ok) {
        console.log("Failed to fetch questions");
        return;
      }
      const data = await response.json();

      // Sorting by newest questions first
      const sortedQuestions = data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAllQuestions(sortedQuestions); // Store all questions
      setRecentQuestions(sortedQuestions.slice(0, visiblePosts)); // Initially show only visiblePosts
    } catch (error: any) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this new function to handle loading more posts
  const loadMorePosts = () => {
    const newVisiblePosts = visiblePosts + postsPerLoad;
    setVisiblePosts(newVisiblePosts);
    setRecentQuestions(allQuestions.slice(0, newVisiblePosts));
  };

  const highlightSearchText = (text: string, searchQuery: string) => {
    if (!text || !searchQuery.trim()) return text;

    try {
      const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, "gi");
      return text.replace(
        regex,
        '<span class="bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-0.5 rounded-sm">$1</span>'
      );
    } catch (e) {
      return text; // Return original text if regex fails
    }
  };

  // Helper function to escape regex special characters
  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setRecentQuestions(allQuestions.slice(0, visiblePosts));
    } else {
      const filtered = allQuestions.filter((q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setRecentQuestions(filtered.slice(0, visiblePosts));
    }
  }, [searchQuery, allQuestions, visiblePosts]);

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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds

    try {
      if (!postId || !question) {
        throw new Error("postId and question are required.");
      }

      const response = await fetch("/api/post/aianswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, question }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate AI answer.");
      }

      const data = await response.json();

      setRecentQuestions((prevQuestions: any) =>
        prevQuestions.map((q: any) =>
          q._id === postId ? { ...q, aiAnswer: data.data } : q
        )
      );
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn("AI answer request aborted due to timeout.");
      } else {
        console.error("Error generating AI answer:", error.message);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitBtnLoading(true);
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
    } finally {
      setSubmitBtnLoading(false);
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
        .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-gray-900 dark:text-neutral-100 mt-3 mb-1">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-gray-900 dark:text-neutral-50 mt-4 mb-2">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-xl font-extrabold text-gray-900 dark:text-white mt-5 mb-3">$1</h1>')

        // Code Blocks
        .replace(
          /```([\s\S]+?)```/g,
          `<pre class="rounded-xl overflow-x-auto p-4 bg-neutral-950 text-neutral-200 text-sm font-mono my-3 shadow-inner"><code class="language-js">$1</code></pre>`
        )

        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-neutral-100 dark:bg-neutral-800 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>'
        )

        // Bold Text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-950 dark:text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800 dark:text-neutral-200">$1</em>')

        // Blockquotes
        .replace(
          /^> (.*$)/gm,
          '<blockquote class="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/10 pl-4 py-1 italic my-2 text-neutral-600 dark:text-neutral-400">$1</blockquote>'
        )

        // Lists
        .replace(/^[-*] (.*$)/gm, '<li class="list-disc ml-5 my-1 text-neutral-700 dark:text-neutral-300">$1</li>')

        // Links
        .replace(
          /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g,
          '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium" target="_blank">$1</a>'
        )

        // Tables (Handle Markdown tables)
        .replace(
          /\|(.+?)\|\n\|(?:-+\|)+\n((?:\|.+?\|\n?)+)/g,
          (match, headers, rows) => {
            const headerHtml = `<thead class="bg-neutral-50 dark:bg-neutral-800"><tr>${(headers as string)
              .split("|")
              .map((h) => `<th class="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-semibold">$h.trim()}</th>`)
              .join("")}</tr></thead>`;

            const rowsHtml = `<tbody>${(rows as string)
              .trim()
              .split("\n")
              .map(
                (row) =>
                  `<tr class="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">${row
                    .split("|")
                    .map(
                      (cell) =>
                        `<td class="border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm">${cell.trim()}</td>`
                    )
                    .join("")}</tr>`
              )
              .join("")}</tbody>`;

            return `<div class="overflow-x-auto my-4"><table class="table-auto border-collapse border border-neutral-200 dark:border-neutral-700 w-full text-left text-neutral-700 dark:text-neutral-300">${headerHtml}${rowsHtml}</table></div>`;
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
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200 selection:bg-blue-500/20">
        <Toaster position="top-center" />

        <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-6 shadow-sm border border-blue-100/50 dark:border-blue-900/30">
              <FaGraduationCap className="text-3xl" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">
              Welcome to Queryly
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Your AI-powered Q&A platform for TMV College. Ask questions and get instant, smart architectural breakdowns.
            </p>
          </div>

          {/* Form Box */}
          <div className="bg-white dark:bg-neutral-900 p-5 sm:p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm mb-12">
            <Form
              form={questionForm}
              onFinish={handleSubmit}
              layout="vertical"
              className="space-y-4"
            >
              <Form.Item
                name="question"
                className="mb-3"
                rules={[{ required: true, message: "Please enter your question" }]}
              >
                <Input
                  placeholder="Ask a question about TMV College..."
                  className="w-full px-4 py-3 text-base border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none text-neutral-900 dark:text-white dark:bg-neutral-950 placeholder-neutral-400 transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
                />
              </Form.Item>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <Form.Item name="category" initialValue={selectedCategory} className="mb-0 flex-1 sm:max-w-[200px]">
                  <Select 
                    onChange={(value) => setSelectedCategory(value)}
                    className="w-full h-11 rounded-xl dark:bg-neutral-950"
                  >
                    {categories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<FiSend />}
                    loading={submitBtnLoading}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 border-none text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Submit Question
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>

          {loading ? (
            <div className="space-y-6">
              <PageSkeleton />
              <PageSkeleton />
              <PageSkeleton />
            </div>
          ) : (
            <div className="mt-8">
              {/* Filter Head Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800/60 pb-5 mb-8">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  Recent Questions
                  <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full font-normal">
                    {allQuestions.length}
                  </span>
                </h2>

                {/* Inline Search Input */}
                <div className="relative w-full sm:max-w-xs">
                  <Input
                    placeholder="Search questions..."
                    prefix={<FiSearch className="text-neutral-400 mr-1" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white dark:bg-neutral-900 placeholder-neutral-400 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Feed List Container */}
              <div className="space-y-6">
                {recentQuestions.map((question: any) => (
                  <div
                    key={question._id}
                    className="bg-white dark:bg-neutral-900 p-5 sm:p-6 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
                  >
                    {/* Header Author Line */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={question.author.user.avatar}
                          alt={question.author.user.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                        />
                        <div>
                          <p className="font-semibold text-sm text-neutral-900 dark:text-white leading-tight">
                            {question.author.user.name}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                            {new Date(question.createdAt).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg border border-blue-100/50 dark:border-blue-900/20">
                        {question.semester}
                      </span>
                    </div>

                    {/* Question Title Text */}
                    <h3
                      className="text-lg font-bold text-neutral-900 dark:text-white mb-4 leading-snug"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchText(
                          question.question,
                          searchQuery
                        ),
                      }}
                    ></h3>

                    {/* Meta Interaction Items Bar */}
                    <div className="flex items-center gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4 text-neutral-500 dark:text-neutral-400">
                      <button
                        onClick={() => handleUpvote(question._id)}
                        className="flex items-center gap-1.5 text-xs font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                      >
                        {question.upvotes?.includes(userIdMain) ? (
                          <FaThumbsUp className="text-sm text-blue-600 dark:text-blue-400" />
                        ) : (
                          <FiThumbsUp className="text-sm text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        )}
                        <span>{question.upvotesCount || 0} Upvotes</span>
                      </button>
                      <span className="text-xs text-neutral-300 dark:text-neutral-700">|</span>
                      <span className="text-xs font-medium">
                        {question.comments.length} Comments
                      </span>
                    </div>

                    {/* AI Smart Insight Answer Block */}
                    <div className="mb-6 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800/60 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          AI Answer Insight
                        </h4>
                      </div>
                      
                      {aiLoading ? (
                        <AiSkeleton />
                      ) : (
                        <div className="max-h-[280px] overflow-y-auto pr-1 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                          <p
                            className="space-y-2"
                            dangerouslySetInnerHTML={{
                              __html: formatText(
                                question?.aiAnswer
                                  ? question?.aiAnswer
                                  : "Check The Question you have enter !!"
                              ),
                            }}
                          ></p>
                        </div>
                      )}
                    </div>

                    {/* Context Comments Tree Section */}
                    <div className="mt-4 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
                        Discussion Thread
                      </h4>
                      
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                        {question?.comments?.length > 0 ? (
                          question.comments.map(
                            (comment: any) =>
                              comment?._id && (
                                <div
                                  key={comment._id}
                                  className="flex items-start gap-2.5 text-sm"
                                strat-clean-comment>
                                  <img
                                    src={
                                      comment?.avatar ||
                                      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png"
                                    }
                                    className="w-7 h-7 rounded-full object-cover mt-0.5 ring-1 ring-neutral-100 dark:ring-neutral-800"
                                  />
                                  <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200/30 dark:border-neutral-800/30">
                                    <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-200 mb-0.5">
                                      {comment?.name || "Anonymous User"}
                                    </p>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-normal">
                                      {comment?.text || "No content available"}
                                    </p>
                                  </div>
                                </div>
                              )
                          )
                        ) : (
                          <p className="text-xs italic text-neutral-400 dark:text-neutral-500 pl-1">
                            No comments submitted to this thread yet.
                          </p>
                        )}
                      </div>

                      {/* Comment Submission Unit Form */}
                      <Form
                        onFinish={(values) =>
                          handleComment(values, question?._id)
                        }
                        className="mt-4 flex items-center gap-2"
                      >
                        <Form.Item name="comment" className="flex-1 mb-0">
                          <Input
                            placeholder="Add to the discussion..."
                            required
                            className="w-full h-10 px-3 text-sm border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white dark:bg-neutral-950 placeholder-neutral-400 focus:outline-none"
                          />
                        </Form.Item>
                        <Form.Item className="mb-0">
                          <Button
                            htmlType="submit"
                            icon={<FiSend className="text-xs" />}
                            className="h-10 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white text-xs font-medium rounded-xl border-none flex items-center justify-center gap-1.5 transition-colors"
                          >
                            Send
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Lazy Load View Trigger Button */}
              {visiblePosts < allQuestions.length && (
                <div className="text-center mt-10">
                  <Button
                    onClick={loadMorePosts}
                    className="h-11 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 text-sm font-medium rounded-xl transition-all"
                  >
                    Load More ({allQuestions.length - visiblePosts} remaining)
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
