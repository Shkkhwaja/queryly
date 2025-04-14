'use client';
import React, { useState } from "react";
import BgImg from "../../../../../public/Images/login-bg-image.webp";
import { Button, Form, Input } from "antd";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';


const AdminForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (values: any) => {
    setSubmitting(true);
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  
    try {
      if (values.email === adminUsername && values.password === adminPassword) {
        const token = btoa(
          JSON.stringify({
            role: "admin",
            email: values.email,
            exp: Date.now() + 1000 * 60 * 60 * 24, // 1 day expiry
          })
        );
  
        // Store the token in cookies instead of localStorage
        Cookies.set('adminToken', token, { expires: 1 });  // 1-day expiry
        Cookies.set('isLoggedIn', 'true', { expires: 1 });
  
        toast.success("Admin login successful");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-center" />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${BgImg.src})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="relative z-10 bg-white shadow-lg rounded-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-8">
        <h1 className="text-center text-4xl font-lobster text-red-600">Queryly Admin</h1>
        <p className="text-center text-gray-700 mt-2">
          Admin Panel Access Only
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">Admin Login</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <Form onFinish={handleAdminLogin} className="space-y-4">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type="email"
              placeholder="Admin email"
              className="border-2 border-black rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Admin password"
              className="border-2 border-black rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            className="w-full bg-black text-white hover:bg-gray-700"
            loading={submitting}
          >
            {submitting ? "Logging in..." : "Login as Admin"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AdminForm;
