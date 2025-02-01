'use client';
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import BgImg from "../../../../public/Images/login-bg-image.webp";
import { Button, Form, Input, Modal } from "antd";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Link from 'next/link'
import { useRouter } from "next/navigation";




const SigninForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter()
  
  const handleSubmitSignin = async (values: any) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/users/login",{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:values.email,
          password:values.password
        })
      })

      const data = await response.json()
      if(response.ok){
        toast.success("Login Successfully")
        localStorage.setItem("isLoggedIn", "true");
        router.push("/")
      }else{
        toast.error(data.error || "An error occurred during Login.")
      }
      
    } catch (error:any) {
      toast.error(error || "Server Error")
      
    }finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
<Toaster
  position="top-center"
/>
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

        <div className="mt-4 flex justify-center items-center w-full">
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
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              type="email"
              placeholder="Your email"
              className="border-2 border-black focus:border-gray-200 focus:ring focus:ring-gray-200 hover:border-gray-400 transition-colors duration-200 rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Your password"
              className="border-2 border-black focus:border-gray-200 focus:ring focus:ring-gray-200 hover:border-gray-400 transition-colors duration-200 rounded-lg px-4 py-2"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            className="w-full bg-black text-white hover:bg-gray-700 transition-colors duration-200"
            loading={submitting}
          >
            {submitting ? "Submitting..." : "Login"}
          </Button>
        </Form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            Not Registered?{" "}
            <Link href="/form/signup"><button className="text-black hover:underline">Sign up</button></Link>
          </p>
          {/* <p className="mt-1">
            <button className="text-black hover:underline">Verify Your Email?</button>
          </p> */}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>About • Careers • Privacy • Terms • Contact • Languages • Your Ad Choices</p>
        </div>
      </div>





    </div>
  );
};

export default SigninForm;
