'use client';
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import BgImg from "../../../../public/Images/login-bg-image.webp"; // Still import for optimization
import { Button, Modal, Form, Input, Checkbox } from 'antd';

const Login: React.FC = () => {
  const [openForgot, setOpenForgot] = useState<boolean>(false);
  const [openSignup, setOpenSignup] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false); // Add state for submitting status
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [emailSignin, setEmailSignin] = useState<string>("");
  const [passwordSignin, setPasswordSignin] = useState<string>("");
  const [emailSignup, setEmailSignup] = useState<string>("");
  const [passwordSignup, setPasswordSignup] = useState<string>("");

  // Arrays to store form data
  const [signinData, setSigninData] = useState<any[]>([]);
  const [signupData, setSignupData] = useState<any[]>([]);
  const [forgotData, setForgotData] = useState<any[]>([]);

  // Function to show the loading state for the Forgot Password Modal
  const showLoading = () => {
    setOpenForgot(true);
  };

  const showSignup = () => {
    setOpenSignup(true);
  };

  const handleSubmitSignup = (values: any) => {
    setSubmitting(true);
    // Store Sign Up data in the array
    setSignupData((prevData) => [...prevData, values]);
    console.log("Form Submitted with Data Signup: ", values); // Logs valid data

    setTimeout(() => {
      console.log("Signup Successful");
      setSubmitting(false);
    }, 2000);
  };

  const handleSubmitForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Store Forgot Password data in the array
    setForgotData((prevData) => [...prevData, { email: forgotEmail }]);
    console.log("Forgot Email Data: ", forgotEmail); // Logs valid data
  };

  const handleSubmitSignin = (values: any) => {
    setSubmitting(true);
    // Store Sign In data in the array
    setSigninData((prevData) => [...prevData, values]);
    console.log("Form Submitted with Data Signin: ", values); // Logs valid data

    setTimeout(() => {
      console.log("Signin Successful");
      setSubmitting(false);
    }, 2000);
  };

  // Handle Google login
  const handleGoogleLogin = (response: any) => {
    console.log("Google login successful: ", response);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${BgImg.src})`, // Using imported BgImg for optimization
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset",
          transitionProperty: "background-image",
          transitionDuration: "180ms",
          transitionTimingFunction: "ease-in-out",
        }}
      ></div>

      {/* Login Section */}
      <div className="relative z-10 bg-white shadow-lg rounded-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-8">
        <h1 className="text-center text-3xl font-bold text-red-600">QueryHub</h1>
        <p className="text-center text-gray-700 mt-2">
          A place to share knowledge and better understand the world
        </p>

        {/* Google Login Button */}
        <div className="mt-6 space-y-3">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google login failed")}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Login Form */}
        <Form onFinish={handleSubmitSignin} className="space-y-4">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type="email"
              placeholder="Your email"
              className="w-full"
              value={emailSignin}
              onChange={(e) => setEmailSignin(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Your password"
              className="w-full"
              value={passwordSignin}
              onChange={(e) => setPasswordSignin(e.target.value)}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={submitting}
          >
            {submitting ? "Submitting..." : "Login"}
          </Button>
        </Form>

        {/* Sign-up and Forgot Password */}
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            Not Register : 
            <button onClick={showSignup} className="text-blue-500 hover:underline">
              Sign up 
            </button>
          </p>
          <p className="mt-1">
            <button onClick={showLoading} className="text-blue-500 hover:underline">
              Forgot password?
            </button>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            About • Careers • Privacy • Terms • Contact • Languages • Your Ad
            Choices
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        title={<p>Forgot Password</p>}
        footer={
          <Button className="bg-black text-white" onClick={handleSubmitForgotPassword}>
            Submit
          </Button>
        }
        open={openForgot}
        onCancel={() => setOpenForgot(false)}
      >
        <Form onFinish={handleSubmitForgotPassword}>
          <Form.Item
            name="forgotEmail"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type="email"
              placeholder="Your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Signup Modal */}
      <Modal
        title={<p>SignUp</p>}
        footer={
          // No need for onClick, as the form will handle the submit
          <Button
            className="bg-black text-white"
            htmlType="submit"
            form="signupForm"
          >
            Submit
          </Button>
        }
        open={openSignup}
        onCancel={() => setOpenSignup(false)}
      >
        <Form
          onFinish={handleSubmitSignup}
          id="signupForm" // Added ID to ensure correct form submission
        >
          <Form.Item
            name="emailSignup"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type="email"
              placeholder="Your email"
              value={emailSignup}
              onChange={(e) => setEmailSignup(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="passwordSignup"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Your password"
              value={passwordSignup}
              onChange={(e) => setPasswordSignup(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="terms-and-condition"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error("Please accept terms and conditions")),
              },
            ]}
          >
            <Checkbox className="font-medium">
              I have read the{" "}
              <a target="_blank" href="/terms-and-conditions" className="text-blue-500">
                Terms & Conditions
              </a>
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
