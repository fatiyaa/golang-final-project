"use client";

import { useState } from 'react';
import CalendarPopup from './CalendarPopup';
import GuestSelector from './GuestSelector';
import { Range } from 'react-date-range';  // Import Range dari react-date-range
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
}

export default function RoomSelector({ rooms, setRooms }: RoomData) {

  const [guests, setGuests] = useState<Guests>({
    rooms: 0,
    adults: 0,
    children: 0,
    infants: 0,
  });

  const [selectedDates, setSelectedDates] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

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
      setRooms(data.data.Rooms);  // Update room data in the parent (Dashboard)
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
          <CalendarPopup selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
          
          <GuestSelector guests={guests} setGuests={setGuests} />
        </div>

        {/* Search Button */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500" onClick={onSearch}>
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
