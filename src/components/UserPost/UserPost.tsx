"use client";

import React, { useState, useEffect } from "react";
import { Avatar, Input, Form, Select, Button } from "antd";
import PageSkeleton from "../Skeleton/PageSkeleton/PageSkeleton";
import AiSkeleton from "../Skeleton/AiSkeleton/AiSkeleton";
import { toast } from "react-hot-toast";
import { FiSend, FiThumbsUp } from "react-icons/fi";
import { FaGraduationCap, FaThumbsUp } from "react-icons/fa";
import { Toaster } from "react-hot-toast";

const UserPost: React.FC = () => {
  interface Metrics {
    posts: number;
    questions: number;
  }
  
  type Comment = {
    _id: string;
    text: string;
    avatar: string;
    name: string;
  };

  interface Question {
    _id: string;
    question: string;
    semester: string;
    author: {
      user: {
        _id: string;
        avatar: string;
        name: string;
      };
    };
    createdAt: string;
    comments: Comment[];
    aiAnswer?: string;
    upvotes: string[];
    upvotesCount: number;
  }

  type UserUpvotes = Record<string, boolean>;

  const [userUpvotes, setUserUpvotes] = useState<UserUpvotes>({});
  const [deletingPosts, setDeletingPosts] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [newAvatar, setNewAvatar] = useState("");
  const [newName, setNewName] = useState("");
  const [metrics, setMetrics] = useState<Metrics>({ posts: 0, questions: 0 });
  const [userIdMain, setUserIdMain] = useState<string>("");
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeletePost = async (postId: string) => {
    setDeletingPosts(prev => ({ ...prev, [postId]: true }));
    try {
      const response = await fetch("/api/post/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete post");
      }

      toast.success(result.message || "Post deleted successfully");
      
      setQuestions(prev => prev.filter(q => q._id !== postId));
      setMetrics(prev => ({
        ...prev,
        questions: prev.questions - 1,
      }));
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Failed to delete post");
    } finally {
      setDeletingPosts(prev => ({ ...prev, [postId]: false }));
      setPostToDelete(null);
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
    const post = questions.find((q: any) => q._id === postId);
    const alreadyUpvoted = post?.upvotes?.includes(userId);

    // Optimistic UI update
    setUserUpvotes((prev) => ({ ...prev, [postId]: !alreadyUpvoted }));

    
    setQuestions((prev): any =>
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

      setQuestions((prev): any =>
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

    const post = questions.find((q: Question) => q._id === postId);
    if (!post) {
      toast.error("No matching post found");
      return;
    }

    const tempId = Date.now().toString();
    const tempComment: Comment = {
      _id: tempId,
      text: values.comment,
      avatar: newAvatar,
      name: newName,
    };

    setQuestions((prev: Question[]) =>
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
      const savedComment: Comment = {
        _id: data._id,
        text: values.comment,
        avatar: newAvatar,
        name: newName,
      };

      setQuestions((prev: Question[]) =>
        prev.map((q) =>
          q._id === postId
            ? { 
                ...q, 
                comments: [
                  ...q.comments.filter(c => c._id !== tempId),
                  savedComment
                ] 
              }
            : q
        )
      );

      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
      setQuestions((prev: Question[]) =>
        prev.map((q) =>
          q._id === postId
            ? { ...q, comments: q.comments.filter(c => c._id !== tempId) }
            : q
        )
      );
    }
  };

  const formatText = (text: string) => {
    if (!text) return "";

    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-extrabold">$1</h1>')
      .replace(
        /```([\s\S]+?)```/g,
        `<pre class="rounded-lg overflow-x-auto p-3 bg-gray-900 text-white"><code class="language-js">$1</code></pre>`
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-200 text-red-500 p-1 rounded">$1</code>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-extrabold">$1</span>')
      .replace(/\*(.*?)\*/g, '<span class="font-bold">$1</span>')
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-gray-500 pl-4 italic">$1</blockquote>'
      )
      .replace(/^[-*] (.*$)/gm, '<li class="list-disc ml-6">$1</li>')
      .replace(
        /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" class="text-blue-500 underline" target="_blank">$1</a>'
      )
      .replace(
        /\|(.+?)\|\n\|(?:-+\|)+\n((?:\|.+?\|\n?)+)/g,
        (match, headers, rows) => {
          const headerHtml = `<tr>${headers.split("|")
            .map((h: string) => `<th class="border px-4 py-2">${h.trim()}</th>`)
            .join("")}</tr>`;
          const rowsHtml = rows.trim().split("\n")
            .map((row: string) => `<tr>${row.split("|")
              .map((cell: string) => `<td class="border px-4 py-2">${cell.trim()}</td>`)
              .join("")}</tr>`)
            .join("");
          return `<table class="table-auto border-collapse border border-gray-300 w-full text-left">${headerHtml}${rowsHtml}</table>`;
        }
      )
      .replace(/\n/g, "<br>");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingQuestions(true);
        const userResponse = await fetch("/api/users/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!userResponse.ok) throw new Error("Failed to fetch user profile");
        
        const userData = await userResponse.json();
        await fetchUserQuestions(userData.data._id); // Call the new query param version
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
        console.error("Fetch error:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };
  
    const fetchUserQuestions = async (userId: string) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/post/userquestion?userId=${encodeURIComponent(userId)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (!result.success || !result.data) throw new Error("Invalid response format");
          
          setQuestions(result.data);
          setMetrics((prev) => ({ ...prev, questions: result.data.length }));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch questions");
        }
      } catch (error: any) {
        console.error("Error fetching questions:", error);
        toast.error(error.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  return (
    <div>
      <Toaster position="top-center" />
      {loading ? (
        <>
          <PageSkeleton />
          <PageSkeleton />
          <PageSkeleton />
        </>
      ) : (
        <div className="w-[90vw] mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white m-6 mt-10">
            Your Posts
          </h2>
          <div className="space-y-6 mt-[4em]">
            {questions.map((question: any) => (
              <div
                key={question._id}
                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-neutral-800"
              >
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
                      {new Date(question.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {question.question}
                </h3>

                <div className="flex justify-between items-center mb-4">
  <div className="flex items-center gap-2">
    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
      {question.semester}
    </span>
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {question.comments.length} Comments
    </span>
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

  {userIdMain === question.author.user._id && (
    <button
      onClick={() => setPostToDelete(question._id)}
      disabled={deletingPosts[question._id]}
      className={`text-red-500 hover:text-red-700 text-sm flex items-center gap-1 ${
        deletingPosts[question._id] ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {deletingPosts[question._id] ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
      {deletingPosts[question._id] ? "Deleting..." : "Delete"}
    </button>
  )}
</div>


                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  AI Answer:
                </h4>
                {aiLoading ? (
                  <AiSkeleton />
                ) : (
                  <div className="relative bg-transparent dark:bg-blue-900/30 p-5 rounded-xl dark:border-blue-500 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-200 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-blue-900 rounded-sm shadow-sm">
                    <p
                      className="text-gray-900 dark:text-gray-200 font-medium tracking-wide leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatText(question?.aiAnswer),
                      }}
                    ></p>
                  </div>
                )}

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

                  <Form
                    onFinish={(values) => handleComment(values, question?._id)}
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

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Delete Post</h3>
            <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeletePost(postToDelete);
                }}
                disabled={deletingPosts[postToDelete]}
                className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ${
                  deletingPosts[postToDelete] ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {deletingPosts[postToDelete] ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPost;