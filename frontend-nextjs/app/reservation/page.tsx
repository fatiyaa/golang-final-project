'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

import RoomSelector from '../components/RoomSelector';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRoomData = async (token: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8888/api/room', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room data');
      }

      const data = await response.json();
      console.log(data);
      setRoomData(data.data.Rooms);  // Update room data in the parent (Dashboard)
    } catch (err) {
      console.error('Error fetching room data:', err);
    }
  };


  useEffect(() => {
    // Memeriksa apakah token ada di cookies
    const token = Cookies.get('auth_token');
    console.log(token);
    
    if (!token) {
      // Jika tidak ada token, redirect ke halaman login
      router.push('/login');
    } else {
      fetchRoomData(token);
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
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
      <RoomSelector  rooms={[]} setRooms={setRoomData} />
      {/* Full Width container for room */}
        <div className="flex flex-col items-center px-6 py-8 mx-auto w-full gap-4">
      {roomData.map((room: any) => (
        <Link
          key={room.id}  // Use room.id as key if available
          href={`/dashboard/${room.id}`}  // Dynamic route to room details page (adjust the URL as per your route structure)
          passHref
          className='flex flex-col items-center mx-auto w-full'
        >
          <div className="relative w-full sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex items-center cursor-pointer hover:shadow-lg transition-shadow duration-300">
            {/* Image with rounded left corners */}
            <img
              src="https://files.ayana.com/r/kv-02_VoyjOw_3200x0.webp"  // Replace with your image URL
              alt="Ocean View Room"
              width={360}
              height={80}
              className="h-[14.375rem] rounded-t-lg w-[327px] shrink-0 rounded-bl-lg rounded-br-none rounded-tr-none object-cover object-center"
            />
            <div className='justify-between gap-7 rounded-b-lg flex h-[230px] w-[calc(100%-327px)] flex-row items-center rounded-bl-none rounded-br-lg rounded-tl-none rounded-tr-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700 p-6'>
              {/* Room Details */}
              <div className="ml-4 flex-1 pb-6">
                <h3 className="pb-2 font-semibold text-4xl text-gray-900 dark:text-white">{room.name}</h3>
                <div>
                  <span>{room.hotel.name} • {room.type}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-200">{room.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-200">King/Twin</p>
              </div>
              {/* Price Section */}
              <div className="flex flex-col gap-1.5 text-sm leading-5 text-[#7A7A7A] md:text-base md:leading-6 w-[242px] border-l border-l-gray-400 pl-8 shadow-2">
                <div className='inline-flex items-center gap-2 rounded-md p-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 bg-blue-50 text-blue-500 mb-5 w-fit px-[0.625rem]'>
                  <span>1 Deals</span>
                </div>
                <p className="text-gray-500 dark:text-gray-300">Starting from</p>
                <p className="flex items-center gap-1 dark:text-gray-200">
                  <span className='text-xl font-medium leading-5 tracking-[0.0125rem] text-gray-800 md:text-[1.375rem] dark:text-gray-200 md:leading-8'>Rp {new Intl.NumberFormat('id-ID').format(room.base_price)}</span>
                  <span>/</span>
                  <span>Night</span>
                </p>
                <div className='flex flex-col text-xs leading-5 md:text-sm dark:text-gray-00'>
                  <p className='flex items-center gap-1'>
                    <span>Rp {new Intl.NumberFormat('id-ID').format(room.base_price * 3)}</span>
                    <span>/</span>
                    <span>3 Nights</span>
                  </p>
                  <p>Total excludes taxes & fees</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
    </section>
  );
};

export default Dashboard;
