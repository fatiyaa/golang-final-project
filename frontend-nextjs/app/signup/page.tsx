'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name </label>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Name"
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        
        <div>
          <label>Email </label>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: 'Invalid email address' } })}
            placeholder="Email"
            type="email"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone Number </label>
          <input
            {...register('telp_number', { required: 'Phone number is required', pattern: { value: /^[0-9]+$/, message: 'Phone number must be numeric' } })}
            placeholder="Phone Number"
          />
          {errors.telp_number && <p>{errors.telp_number.message}</p>}
        </div>

        <div>
          <label>Password </label>
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 3, message: 'Password must be at least 3 characters' } })}
            placeholder="Password"
            type="password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}
