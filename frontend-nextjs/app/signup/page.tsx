'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SignUpForm = {
  name: string;
  email: string;
  telp_number: string;
  password: string;
};

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { back } = useRouter();

  const onSubmit = async (data: SignUpForm) => {
    try {
      console.log(data);
        const response = await axios.post('http://localhost:8888/api/user', data);
      console.log(response);
      if (response.status === 200) {
        setSuccessMessage('Account created successfully! You can now log in.');
        setErrorMessage(null);
        setTimeout(() => router.push('/login'), 2000); // Redirect to login page after 2 seconds
      }
    } catch (err: any) {
        console.log(err);
      setErrorMessage(err.response?.data?.message || 'Sign up failed');
      setSuccessMessage(null);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="px-6 py-8 w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <button onClick={() => back()} className="top-6 left-6 p-2 mb-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 text-gray-800 dark:text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
        </button>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-5">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium dark:text-white">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              placeholder="Name"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium dark:text-white">Email</label>
            <input
              {...register('email', { 
                required: 'Email is required', 
                pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: 'Invalid email address' } 
              })}
              placeholder="Email"
              type="email"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
  
          <div>
            <label htmlFor="telp_number" className="block mb-2 text-sm font-medium dark:text-white">Phone Number</label>
            <input
              {...register('telp_number', { 
                required: 'Phone number is required', 
                pattern: { value: /^[0-9]+$/, message: 'Phone number must be numeric' } 
              })}
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.telp_number && <p className="text-red-500 text-sm mt-1">{errors.telp_number.message}</p>}
          </div>
  
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium dark:text-white">Password</label>
            <input
              {...register('password', { 
                required: 'Password is required', 
                minLength: { value: 3, message: 'Password must be at least 3 characters' } 
              })}
              placeholder="Password"
              type="password"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
  
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
  
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
            Login here
          </Link>
        </p>
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      </div>
    </div>
  </section>
  );
}