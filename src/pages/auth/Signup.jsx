import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeSimple, Lock, UserIcon } from '@phosphor-icons/react'; // Adjust icon set if needed

function Signup() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-gradient-to-r from-white to-strokedark bg-center flex items-center justify-center"
      // style={{
      //   backgroundImage: "url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      // }}
    >
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-10 max-w-sm w-full backdrop-blur-md">
        <h2 className="text-center text-2xl font-bold tracking-tight dark:text-white">
          Sign up to Hideout
        </h2>

        <form action="#" method="POST" className="space-y-6 mt-8">
            {/* Name */}
            <div>
            <label htmlFor="name" className="block text-sm font-medium dark:text-white">
              Name
            </label>
            <div className="relative mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/80 px-3 py-2 text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-4 top-3 text-gray-500">
                <UserIcon size={20}/>
              </span>
            </div>
          </div>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-white">
              Email address
            </label>
            <div className="relative mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/80 px-3 py-2 text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-4 top-3 text-gray-500">
                <EnvelopeSimple size={20} />
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium dark:text-white">
                Password
              </label>
              {/* <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a> */}
            </div>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="6 characters, 1 capital letter"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white/80 px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-4 top-3 text-gray-500">
                <Lock size={20} />
              </span>
            </div>
          </div>
          {/* Re-type Password Field */}
           <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium dark:text-white">
                Re-type Password
              </label>
              
            </div>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white/80 px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <span className="absolute right-4 top-3 text-gray-500">
                <Lock size={20} />
              </span>
            </div>
          </div>
          {/* Sign Up Button */}
          <div>
            <button
            onClick={()=>{
              navigate('/auth/verify')
            }}
              type="submit"
              className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Create Account
            </button>
          </div>

          {/* Google Sign In Button */}
          <div>
            <button onClick={()=>{
              navigate("/dashboard")
            }} className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              {/* You can add a Google icon here if desired */}
              Sign up with Google
            </button>
          </div>

          {/* Already have an account? */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
