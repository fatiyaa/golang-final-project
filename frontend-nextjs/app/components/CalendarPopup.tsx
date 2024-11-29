'use client';

import { useState } from 'react';
import { DateRange, Range } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function CalendarPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDates, setSelectedDates] =  useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  return (
    <div className="relative">
      {/* Date Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 text-gray-800 flex items-center"
      >
        {`${format(selectedDates.startDate || new Date(), 'dd MMM yyyy')} - ${format(selectedDates.endDate || new Date(), 'dd MMM yyyy')}`}
      </button>

      {/* Calendar Pop-Up */}
      {isOpen && (
        <div className="absolute z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 border dark:border-gray-600 p-4">
          <DateRange
            ranges={[selectedDates]}
            onChange={(range) => setSelectedDates(range.selection)}
            rangeColors={['#f59e0b']}
          />
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-center text-white bg-yellow-500 dark:bg-yellow-600 py-2 mt-4 rounded-lg"
          >
            Apply Dates
          </button>
        </div>
      )}
    </div>
  );
}
