'use client';

import { useState } from 'react';

interface Guests {
  rooms: number;
  adults: number;
  children: number;
  infants: number;
}

interface GuestSelectorProps {
  guests: Guests;
  setGuests: React.Dispatch<React.SetStateAction<Guests>>;
}

export default function GuestSelector({ guests, setGuests }: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleGuestChange = (type: keyof Guests, operation: 'increment' | 'decrement') => {
    setGuests((prev) => ({
      ...prev,
      [type]: operation === 'increment' ? prev[type] + 1 : Math.max(prev[type] - 1, 0),
    }));
  };


  return (
    <div className="relative">
      {/* Guest Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 text-gray-800 flex items-center"
      >
        {`${guests.rooms} Room • ${guests.adults} Adults • ${guests.children} Children`}
      </button>

      {/* Guest Dropdown */}
      {isOpen && (
        <div className="absolute z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 p-4 w-64 border dark:border-gray-600">
          {['rooms', 'adults', 'children', 'infants'].map((type) => (
            <div key={type} className="flex justify-between items-center my-2">
              <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleGuestChange(type as keyof Guests, 'decrement')}
                  className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-white"
                >
                  -
                </button>
                <span className="text-gray-800 dark:text-white">{guests[type as keyof Guests]}</span>
                <button
                  onClick={() => handleGuestChange(type as keyof Guests, 'increment')}
                  className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-white"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-center text-white bg-yellow-500 dark:bg-yellow-600 py-2 mt-4 rounded-lg"
          >
            Apply Guests
          </button>
        </div>
      )}
    </div>
  );
}
