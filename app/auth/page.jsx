"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";

export default function AuthPage() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 font-sans"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/d3/7e/3e/d37e3ebd66d484d4af0c6e5750548248.jpg')",
        backgroundPosition: "center",
      }}
    >
      <h1 className="slideInFromTop text-3xl font-bold text-white mb-5 text-center tracking-tight relative">
        Welcome To ICorner
        <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-700 rounded"></span>
      </h1>

      <div
        className={`authContainer ${isSignUpActive ? "rightPanelActive" : ""}`}
      >
        {/* Sign Up Form */}
        <div className="signUpContainer formContainer">
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            {" "}
            {/* ↓ padding nhỏ hơn */}
            <h1 className="text-xl font-bold mb-2 text-white">Sign Up</h1>
            <p className="mb-5 text-gray-400 text-sm">
              Create your account to start shopping
            </p>
            <div className="relative w-full mb-3">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none bg-gray-800/60 text-white placeholder-gray-500 text-sm transition"
              />
            </div>
            <div className="relative w-full mb-3">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none bg-gray-800/60 text-white placeholder-gray-500 text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative w-full mb-4">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none bg-gray-800/60 text-white placeholder-gray-500 text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-2 px-6 py-2.5 text-white font-medium rounded-lg text-sm signUpButton"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="signInContainer formContainer">
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h1 className="text-xl font-bold mb-2 text-white">Sign In</h1>
            <p className="mb-5 text-gray-400 text-sm">
              Welcome back! Please sign in
            </p>

            <div className="relative w-full mb-3">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none bg-gray-800/60 text-white placeholder-gray-500 text-sm transition"
              />
            </div>

            <div className="relative w-full mb-4">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none bg-gray-800/60 text-white placeholder-gray-500 text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <a
              href="#"
              className="mb-4 text-xs text-gray-400 hover:text-blue-100 hover:underline"
            >
              Forgot your password?
            </a>

            <button
              onClick={handleSubmit}
              className="mt-2 px-6 py-2.5 text-white font-medium rounded-lg text-sm signInButton"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Overlay */}
        <div className="overlayContainer">
          <div className="overlay">
            <div className="overlayPanel overlayLeft">
              <h1 className="text-2xl font-bold text-white mb-3">
                Welcome Back!
              </h1>
              <p className="mb-5 text-gray-300 text-sm">
                Sign in to access your account
              </p>
              <button
                onClick={handleSignInClick}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition text-sm"
              >
                Sign In
              </button>
            </div>
            <div className="overlayPanel overlayRight">
              <h1 className="text-2xl font-bold text-white mb-3">New here?</h1>
              <p className="mb-5 text-gray-300 text-sm">
                Join us and start your journey
              </p>
              <button
                onClick={handleSignUpClick}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition text-sm"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
