'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type UserData = {
  id: number;
  name: string;
  email: string;
};

export default function UserPage() {
  const [userData, setUserData] = useState<UserData[] | null>(null); // Menggunakan array untuk menampung data pengguna
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/user');
        console.log(response.data); // Periksa struktur data
        setUserData(response.data.data); // Akses data dari response.data.data
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>User Data</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Periksa apakah userData adalah array dan lakukan map */}
      {userData ? (
        userData.map((user) => (
          <div key={user.id}>
            <p>ID: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p> // Menampilkan pesan saat data masih dimuat
      )}
    </div>
  );
}
