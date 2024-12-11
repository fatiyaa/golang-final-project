'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const Reservation = () => {
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState<any[]>([]); 
  const [iconUrl, setIconUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);  
  const router = useRouter();

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateIcon = () => {
        if (darkModeMediaQuery.matches) {
          // Dark mode icon
          setIconUrl('https://cdn-icons-png.flaticon.com/512/14453/14453589.png');
        } else {
          // Light mode icon
          setIconUrl('https://cdn-icons-png.flaticon.com/512/646/646094.png');
        }
      };

    fetchHotelData();

    updateIcon();

    darkModeMediaQuery.addEventListener('change', updateIcon);

    return () => {
        darkModeMediaQuery.removeEventListener('change', updateIcon);
    };
  }, [router]);

  const fetchHotelData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8888/api/hotel');

        if (!response.data) {
            throw new Error('Failed to fetch hotel data');
        }

        const data = response.data;
        setHotelData(data.data.Hotels);
        console.log(data.data.Hotels);
        setLoading(false);   // Set loading to false once data is fetched
    } catch (err) {
      // Type assertion here: cast `err` to `Error` type
      if (err instanceof Error) {
        setError(err.message);  // Access message safely
      } else {
        setError('An unknown error occurred');  // Fallback error message
      }
      setLoading(false);      // Set loading to false even if there is an error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;  // Show error message if something goes wrong
  }

  return (
    <div>
      {/* Render the fetched hotel data if available */}
      {hotelData && hotelData.length > 0 ? (
        <div className='bg-black w-full'>
            <div className='flex flex-col text-gray-200'>
                {hotelData.map((hotel: any, index: number) => (
                    <div key={hotel.id} className={`flex flex-row gap-3 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                        <img
                            src="https://files.ayana.com/r/kv-02_VoyjOw_3200x0.webp" // Replace with your image URL
                            alt="Ocean View Room"
                            className="h-[30rem] w-[50rem] object-center"
                        />
                        <div className={`flex flex-col ml-2 justify-center gap-5  ${index % 2 === 0 ? '' : 'items-end'}`}>
                            <div className={`flex flex-col ${index % 2 === 0 ? '' : 'items-end'}`}>
                                <h3 className="text-4xl font-bold">{hotel.name}</h3>
                                <h1>{hotel.address}</h1>
                            </div>
                            <div>
                                <p>{hotel.description}</p>
                            </div>
                            <div className={`flex flex-col ${index % 2 === 0 ? '' : 'items-end'}`}>
                                <p className='text-xl font-semibold'>Contact :</p>
                                <div className='flex items-center'>
                                    <img 
                                        src={iconUrl}
                                        alt="Email Icon" 
                                        width="24" 
                                        height="24" 
                                        style={{ marginRight: '8px' }} // Adding a small gap between the icon and text
                                    />
                                    <span>: {hotel.email}</span>
                                </div>
                                <div className='flex items-center'>
                                    <img 
                                        src="https://cdn-icons-png.flaticon.com/512/3891/3891977.png" 
                                        alt="Phone Icon" 
                                        width="24" 
                                        height="24" 
                                        style={{ marginRight: '8px' }} // Adding a small gap between the icon and text
                                    />
                                    <span>: {hotel.phone_number}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
        </div>
      ) : (
        <p>No hotels found.</p>
      )}
    </div>
  );
};

export default Reservation;
