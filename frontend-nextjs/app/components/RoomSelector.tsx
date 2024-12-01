'use client';

import { Dispatch, SetStateAction } from 'react';
import CalendarPopup from './CalendarPopup';
import GuestSelector from './GuestSelector';
import { Range } from 'react-date-range';  // Import Range from react-date-range
import Cookies from 'js-cookie';

interface Guests {
  rooms: number;
  adults: number;
  children: number;
  infants: number;
}

interface RoomData {
  rooms: any[];
  setRooms: React.Dispatch<React.SetStateAction<any[]>>;
  guests: Guests;
  setGuests: React.Dispatch<React.SetStateAction<Guests>>;
  selectedDates: Range;
  setSelectedDates: Dispatch<SetStateAction<Range>>;  // Correct typing for setter
}

export default function RoomSelector({
  rooms,
  setRooms,
  guests,
  setGuests,
  selectedDates,
  setSelectedDates,
}: RoomData) {

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 as getMonth() is zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchRoomData = async (token: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8888/api/order/available/${formatDate(new Date(selectedDates.startDate))}`, {
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
      setRooms(data.data.Rooms); 
      console.log(data.data.Rooms);
    } catch (err) {
      console.error('Error fetching room data:', err);
    }
  };

  const onSearch = () => {
    const token = Cookies.get('auth_token');
    if (token) {
      fetchRoomData(token);
    } else {
      console.log('No token found');
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex-shrink-0">
          Your Logo
        </h1>

        <div className="flex items-center space-x-4">
          <CalendarPopup
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
          />
          
          <GuestSelector
            guests={guests}
            setGuests={setGuests}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500"
            onClick={onSearch}
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
