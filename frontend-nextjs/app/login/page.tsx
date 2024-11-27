'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
        console.log(data);
        const response = await axios.post('http://localhost:8888/api/user/login', data);
        console.log(response); // Check the response data
        if (response.status === 200) {
            // router.push('/dashboard'); // Redirect on success
        }
    } catch (err: any) {
        console.log(err);
        setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
<section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="px-6 py-8 w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Log In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-5">
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
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
              Create here
            </Link>
          </p>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  </section>
  );
}
