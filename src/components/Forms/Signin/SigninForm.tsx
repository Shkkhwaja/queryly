'use client';
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import BgImg from "../../../../public/Images/login-bg-image.webp";
import { Button, Modal, Form, Input, Checkbox } from 'antd';

const SigninForm: React.FC = () => {
  const [formStates, setFormStates] = useState({
    signin: { email: "", password: "" },
    signup: { email: "", password: "", terms: false },
    forgot: { email: "" },
  });

  const [modals, setModals] = useState({
    forgotPassword: false,
    signup: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (form: string, field: string, value: string | boolean) => {
    setFormStates((prevState: any) => ({
      ...prevState,
      [form]: { ...prevState[form], [field]: value },
    }));
  };

  const handleSubmitSignin = (values: any) => {
    setSubmitting(true);
    console.log("Sign In Data:", values);
    setTimeout(() => setSubmitting(false), 2000);
  };

  const handleSubmitSignup = (values: any) => {
    setSubmitting(true);
    console.log("Sign Up Data:", values);
    setTimeout(() => setSubmitting(false), 2000);
  };

  const handleSubmitForgotPassword = () => {
    console.log("Forgot Password Email:", formStates.forgot.email);
    setModals((prev) => ({ ...prev, forgotPassword: false }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
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
        <h1 className="text-center text-3xl font-bold text-red-600">QueryHub</h1>
        <p className="text-center text-gray-700 mt-2">
          A place to share knowledge and better understand the world
        </p>

        <div className="mt-6 space-y-3">
          <GoogleLogin
            onSuccess={(response) => console.log("Google login successful: ", response)}
            onError={() => console.log("Google login failed")}
          />
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <Form onFinish={handleSubmitSignin} className="space-y-4">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}>
            <Input
              type="email"
              placeholder="Your email"
              value={formStates.signin.email}
              onChange={(e) => handleInputChange("signin", "email", e.target.value)}
              className="border-2 border-black focus:border-gray-200 focus:ring focus:ring-gray-200 hover:border-gray-400 transition-colors duration-200 rounded-lg px-4 py-2"
              />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password
              placeholder="Your password"
              value={formStates.signin.password}
              onChange={(e) => handleInputChange("signin", "password", e.target.value)}
              className="border-2 border-black focus:border-gray-200 focus:ring focus:ring-gray-200 hover:border-gray-400 transition-colors duration-200 rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            className="w-full bg-black text-white hover:bg-gray-700 transition-colors duration-200"
            loading={submitting}>
            {submitting ? "Submitting..." : "Login"}
          </Button>
        </Form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            Not Registered?{' '}
            <button
              onClick={() => setModals((prev) => ({ ...prev, signup: true }))}
              className="text-black hover:underline ">
              Sign up
            </button>
          </p>
          <p className="mt-1">
            <button
              onClick={() => setModals((prev) => ({ ...prev, forgotPassword: true }))}
              className="text-black hover:underline">
              Forgot password?
            </button>
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            About • Careers • Privacy • Terms • Contact • Languages • Your Ad Choices
          </p>
        </div>
      </div>

      <Modal
        title="Forgot Password"
        open={modals.forgotPassword} // Change 'visible' to 'open'
        onCancel={() => setModals((prev) => ({ ...prev, forgotPassword: false }))}
        footer={null}>
        <Form onFinish={handleSubmitForgotPassword}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}>
            <Input
              type="email"
              placeholder="Your email"
              value={formStates.forgot.email}
              onChange={(e) => handleInputChange("forgot", "email", e.target.value)}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Sign Up"
        open={modals.signup} // Change 'visible' to 'open'
        onCancel={() => setModals((prev) => ({ ...prev, signup: false }))}
        footer={null}>
        <Form onFinish={handleSubmitSignup}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}>
            <Input
              type="email"
              placeholder="Your email"
              value={formStates.signup.email}
              onChange={(e) => handleInputChange("signup", "email", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password
              placeholder="Your password"
              value={formStates.signup.password}
              onChange={(e) => handleInputChange("signup", "password", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[{
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error("You must accept the terms and conditions")),
            }]}>
            <Checkbox
              checked={formStates.signup.terms}
              onChange={(e) => handleInputChange("signup", "terms", e.target.checked)}>
              I have read the <a href="/terms-and-conditions">Terms & Conditions</a>
            </Checkbox>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default SigninForm;
