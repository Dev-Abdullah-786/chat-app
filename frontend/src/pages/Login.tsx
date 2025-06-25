import { useState } from "react";
import assets from "../assets/assets";

const Login = () => {
  const [authState, setAuthState] = useState("Sign up");
  const [authData, setAuthData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
  });
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {authState}{" "}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {authState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            placeholder="Full Name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            name="fullName"
            value={authData.fullName}
            onChange={handleInput}
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="email"
              value={authData.email}
              onChange={handleInput}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="password"
              value={authData.password}
              onChange={handleInput}
            />
          </>
        )}

        {authState === "Sign up" && isDataSubmitted && (
          <textarea
            rows={4}
            placeholder="provide a short bio..."
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="bio"
            value={authData.bio}
            onChange={handleInput}
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {authState === "Sign up" ? "Create Account" : "Login Now!"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {authState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setAuthState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                onClick={() => {
                  setAuthState("Sign up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
