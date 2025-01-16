'use client';
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import BgImg from "../../../../public/Images/login-bg-image.webp";
import { Button, Form, Input } from "antd";

const Signup: React.FC = () => {
  const [formStates, setFormStates] = useState({
    signup: { email: "", password: "" },
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (form: string, field: string, value: string | boolean) => {
    setFormStates((prevState: any) => ({
      ...prevState,
      [form]: { ...prevState[form], [field]: value },
    }));
  };

  const handleSubmitSignup = (values: any) => {
    setSubmitting(true);
    console.log("Signup Data:", values);
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${BgImg.src})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Signup Card */}
      <div className="relative z-10 bg-white shadow-lg rounded-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-8">
        <h1 className="text-center text-3xl font-bold text-red-600">QueryHub</h1>
        <p className="text-center text-gray-700 mt-2">
          A place to share knowledge and better understand the world
        </p>

        {/* Google Login */}
        <div className="mt-6 space-y-3">
          <GoogleLogin
            onSuccess={(response) => console.log("Google login successful: ", response)}
            onError={() => console.log("Google login failed")}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Signup Form */}
        <Form onFinish={handleSubmitSignup} layout="vertical" className="space-y-4">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type="email"
              placeholder="Your email"
              value={formStates.signup.email}
              onChange={(e) => handleInputChange("signup", "email", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Your password"
              value={formStates.signup.password}
              onChange={(e) => handleInputChange("signup", "password", e.target.value)}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={submitting}
          >
            {submitting ? "Submitting..." : "Signup"}
          </Button>
        </Form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            About • Careers • Privacy • Terms • Contact • Languages • Your Ad Choices
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
