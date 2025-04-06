"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCamera, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Header from "@/components/Header/Header";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserAvatar } from "@/store/userSlice";
import UserPost from "@/components/UserPost/UserPost";


interface Question {
  _id: string;
  question: string;
  semester: string;
  createdAt: string;
  aiAnswer?: string;
}
interface Metrics {
  posts: number;
  questions: number;
}

const Profile = () => {
  const router = useRouter();
  const [localAvatar, setLocalAvatar] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showEmail, setShowEmail] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({ posts: 0, questions: 0 });


  
  const fetchUserQuestions = async (userId: string) => {
    try {
      const response = await fetch(`/api/post/userquestion/${userId}`);
      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch questions");
      }

      setQuestions(result.data);
      setMetrics(prev => ({
        ...prev,
        questions: result.data.length,
      }));
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      toast.error(error.message || "Failed to load questions");
    }
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
        const { _id, name, email, avatar } = userData.data || {};
  
        if (!_id) throw new Error("Invalid user data");
  
        setData(userData.data);
        setName(name);
        setEmail(email);
        setLocalAvatar(avatar || "");
  
        fetchUserQuestions(_id);
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
        console.error("Fetch error:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  

  // useEffect(() => {
  //   console.log("Questions updated:", questions);
  // }, [questions]); 



  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Logout Successfully");
        router.push("/form/signin");
      } else {
        toast.error("Failed to logout.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred.");
    }
  };

  const updateAvatar = async () => {
    try {
      const response = await fetch("/api/users/updateavatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cloudinaryAvatar: localAvatar,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Avatar Updated successfully");
      } else {
        toast.error(data.error || "An error during Avatar Update.");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   console.log("Updated Cloudinary Avatar:", localAvatar);
  // }, [localAvatar]);



  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch("/api/post/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify({ postId }),
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete post");
      }
  
      toast.success(result.message || "Post deleted successfully");
      
      // Refresh the questions list after deletion
      if (data?._id) {
        const updatedQuestions = questions.filter(q => q._id !== postId);
        setQuestions(updatedQuestions);
        setMetrics(prev => ({
          ...prev,
          questions: updatedQuestions.length,
        }));
      }
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Failed to delete post");
    }
  };




  return (
    <>
      <Header />
      <div
        className={`min-h-screen ${
          isDarkMode ? "dark:bg-gray-900 dark:text-white" : "bg-gray-50"
        } py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950`}
      >
        <div className="max-w-3xl mx-auto">
          <Toaster position="top-center" />
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between mb-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <FaSignOutAlt size={16} />
                  Logout
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative group">
                  {localAvatar ? (
                    <Image
                    src={localAvatar}
                    alt="User avatar"
                    width={132}
                    height={132}
                    className="rounded-full object-cover aspect-square border-[3px] border-blue-800 dark:border-gray-800 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  
                  ) : (
                    <div className="w-[132px] h-[132px] rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                  )}
                  <CldUploadWidget
                    uploadPreset="queryly"
                    onSuccess={async (result) => {
                      const info = result.info as { secure_url?: string };
                      const avatarUrl = info?.secure_url || "";
                      setLocalAvatar(avatarUrl);
                      try {
                        const response = await fetch(
                          "/api/users/uploadavatar",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              cloudinaryAvatar: avatarUrl,
                            }),
                          }
                        );

                        const data = await response.json();
                        if (response.ok) {
                          toast.success("Avatar updated successfully");
                        } else {
                          toast.error(
                            data.message || "Failed to update avatar"
                          );
                        }
                      } catch (error: any) {
                        toast.error(
                          error.message ||
                            "An error occurred while updating avatar"
                        );
                      }
                    }}
                    onError={(error) => console.error("Upload error:", error)}
                  >
                    {({ open }) => (
                      <button
                        onClick={() => open()}
                        className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
                      >
                        <FaCamera size={16} />
                      </button>
                    )}
                  </CldUploadWidget>
                  
                </div>

                <div className="mt-6 text-center">
                  <h1 className="text-2xl font-bold">{name}</h1>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      {showEmail
                        ? email
                        : email.replace(/(.{2})(.*)(?=@)/, "$1**")}
                    </p>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      {showEmail ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-3xl font-bold text-blue-500">
                  {metrics.questions}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Questions</p>
              </div>
            </div>
          </div>
        </div>
        <Toaster position="top-center" />
        <UserPost />
      </div>
    </>
  );
};

export default Profile;
