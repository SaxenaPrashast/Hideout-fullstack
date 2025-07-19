import { EnvelopeIcon, LockIcon } from '@phosphor-icons/react';
import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div
      className="min-h-screen bg-gradient-to-r from-white to-strokedark bg-center flex items-center justify-center bg-strokedark"
      // style={{
      //   backgroundImage: "url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      // }}
    >
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-10 max-w-sm w-full backdrop-blur-md">
        <h2 className="text-center text-2xl font-bold tracking-tight dark:text-white">
          Sign in to your account
        </h2>

        <form action="#" method="POST" className="space-y-6 mt-8">
            
          <div>
            <label htmlFor="email" className="block text-sm font-medium  dark:text-white">
              Email address
            </label>
            <div className=" relative mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder='enter your e-mail address'
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/80 px-3 py-2 text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <span className='absolute right-4 top-3'>
                <EnvelopeIcon weight='light' size={22}/>
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium dark:text-white">
                Password
              </label>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <div className=" relative mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder='6 characters , 1 capital letter'
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white/80 px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 "
              />
              <span className='absolute right-4 top-3'>
                <LockIcon weight='light' size={22}/>
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Sign in
            </button>
          </div>
          {/* Sign in with google */}
          <div>
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              {/* You can add a Google icon here if desired */}
              Sign up with Google
            </button>
          </div>

          {/* Don't have an account ? Sign up */}
          <div className='mt-6 text-center'>
            <p>
               Don't have an account?{" "}
               <Link to='/auth/signup' className='text-primary'>
               Sign up
               </Link>
            </p>
          </div>
        </form> 
      </div>
    </div>
  );
}

export default Login;
