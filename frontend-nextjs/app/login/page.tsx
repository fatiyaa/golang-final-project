'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
        console.log(data);
        const response = await axios.post('http://localhost:8888/api/user/login', data);
        console.log(response); // Check the response data
        if (response.status === 200) {
            router.push('/dashboard'); // Redirect on success
        }
    } catch (err: any) {
        console.log(err);
        setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="Email" type="email" />
        <input {...register('password')} placeholder="Password" type="password" />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
