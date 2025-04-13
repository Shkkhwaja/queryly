"use client";
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import BgImg from "../../../../public/Images/login-bg-image.webp";
import { Button, Form, Input, Checkbox, FormProps, Modal } from "antd";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const { OTP } = Input;

const SignupForm: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // Store the email to resend OTP

  // Show OTP Modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  type FieldType = {
    name?: string;
    email?: string;
    password?: string;
    terms?: boolean;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
    setSubmitting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          "Signup successful! Please check your email for the OTP."
        );
        setEmail(values.email); // Set the email for OTP resend
        showModal(); // Show OTP Modal after successful signup
      } else {
        toast.error(data.error || "An error occurred during signup.");
      }
    } catch (error) {
      console.log("Error during signup:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (values: { otp: string }) => {
    setLoading(true);

    try {
      const response = await fetch("/api/users/otpverify", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: values.otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP verified successfully!");
        handleOk(); // Close modal
        router.push("/form/signin");
      } else {
        toast.error(data.error || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email is required to resend OTP.");
      return;
    }

    try {
      const response = await fetch("/api/users/resendotp", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "OTP resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
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
        <h1 className="text-center text-4xl font-lobster text-red-600">Queryly</h1>
        <p className="text-center text-gray-700 mt-1">
          A place to share knowledge and better understand the world
        </p>
        <div className="mt-4 flex justify-center items-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.error("Google login failed.")}
          />
        </div>
        <div className="flex items-center my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
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
              I agree to the{" "}
              <Link href="/form/termsandcondition">terms and conditions</Link>
            </Checkbox>
          </Form.Item>
          <p>
            Already Registered?{" "}
            <Link href="/form/signin">
              <button className="text-black font-semibold hover:underline">
                Sign in
              </button>
            </Link>
          </p>
          <Button
            htmlType="submit"
            className="w-full bg-black text-white hover:bg-gray-700 transition-colors duration-200"
            loading={submitting}
          >
            {submitting ? "Submitting..." : "Signup"}
          </Button>
        </Form>
        <div className="mt-5 text-center text-xs text-gray-500">
          <p>About • Privacy • Terms • Contact • Languages • Your Ad Choices</p>
        </div>
      </div>
      <Modal
        title="Verify OTP"
        open={isModalOpen}
        footer={null}
        closable={false}
        width={400}
      >
        <Form
          name="otpForm"
          onFinish={handleOtpSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Enter OTP"
            name="otp"
            rules={[
              { required: true, message: "Please enter your OTP." },
              { len: 6, message: "OTP must be 6 digits." },
              {
                pattern: /^[0-9]+$/,
                message: "OTP must contain numbers only.",
              },
            ]}
          >
            <OTP length={6} />
          </Form.Item>
          <h2
            className="py-4 text-blue-600 underline cursor-pointer text-left inline-block hover:text-blue-500 "
            onClick={handleResendOtp}
          >
            Resend OTP
          </h2>
          <Button
            htmlType="submit"
            className="w-full py-2 bg-black text-white"
            loading={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default SignupForm;
