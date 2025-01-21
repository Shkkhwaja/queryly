'use client';
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import BgImg from "../../../../public/Images/login-bg-image.webp";
import { Button, Form, Input, Checkbox, FormProps } from "antd";
import { jwtDecode } from "jwt-decode";



const SignupForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
    terms?: boolean;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google JWT: ", decoded);
    } else {
      console.error("No credentials found in Google login response.");
    }
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
        <h1 className="text-center text-3xl font-bold text-red-600">
          Queryly
        </h1>
        <p className="text-center text-gray-700 mt-1">
          A place to share knowledge and better understand the world
        </p>

        {/* Google Login */}
        <div className="mt-4 flex justify-center items-center w-full">
  <GoogleLogin
    onSuccess={handleGoogleLoginSuccess}
    onError={() => console.error("Google login failed.")}
  />
</div>


        {/* Divider */}
        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Signup Form */}
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          className="space-y-3"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your Name" }]}
          >
            <Input
              type="text"
              placeholder="Your name"
              className="border-2 border-black focus:border-gray-200 focus:ring focus:ring-gray-200 hover:border-gray-400 transition-colors duration-200 rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type="email"
              placeholder="Your email"
              className="border-2 border-black focus:border-gray-200 focus:ring focus:ring-gray-200 hover:border-gray-400 transition-colors duration-200 rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Your password"
              className="border-2 border-black focus:border-gray-200 focus:ring focus:ring-gray-200 hover:border-gray-400 transition-colors duration-200 rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        "You must accept the terms and conditions."
                      ),
              },
            ]}
          >
            <Checkbox>
              I agree to the <a href="#">terms and conditions</a>
            </Checkbox>
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
        <div className="mt-5 text-center text-xs text-gray-500">
          <p>
            About • Privacy • Terms • Contact • Languages • Your Ad Choices
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
