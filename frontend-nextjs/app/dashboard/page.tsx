'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Memeriksa apakah token ada di cookies
    const token = Cookies.get('auth_token');
    console.log(token);
    
    if (!token) {
      // Jika tidak ada token, redirect ke halaman login
      router.push('/login');
    } else {
      // Jika ada token, lanjutkan loading data dashboard (simulasi)
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    // Menghapus token dari cookies
    Cookies.remove('auth_token');
    
    // Redirect ke halaman login setelah logout
    router.push('/login');
  };


  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="px-6 py-8 w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Dashboard</h1>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Welcome to your dashboard! You are logged in.
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
