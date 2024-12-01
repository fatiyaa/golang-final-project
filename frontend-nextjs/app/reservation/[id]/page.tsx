'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Range } from 'react-date-range';  // Import Range from react-date-range
import Cookies from 'js-cookie';
import axios from 'axios';
import { set } from 'date-fns';

interface Guests {
  rooms: number;
  adults: number;
  children: number;
  infants: number;
}

const RoomDetails = () => {
  const router = useRouter();
  
  const { id } = useParams();
  
  const searchParams = useSearchParams();
  const guests = searchParams.get('guests');
  const selectedDates = searchParams.get('selectedDates');

  const [roomDetails, setRoomDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFloating, setIsFloating] = useState<boolean>(false);
  const token = Cookies.get('auth_token');

  const [guestList, setGuestList] = useState<Guests>({
    rooms: 0,
    adults: 0,
    children: 0,
    infants: 0,
  });
  const [dates, setDates] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  useEffect(() => {
    // Parse guests and selectedDates from query string
    if (guests) {
      setGuestList(JSON.parse(guests));
    }

    if (selectedDates) {
      setDates(JSON.parse(selectedDates));
    }

    const fetchRoomDetails = async () => {
      try {
        setLoading(true);  // Set loading to true before making the request
        const response = await axios.get(`http://127.0.0.1:8888/api/room/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setRoomDetails(response.data.data);  // Set the response data to state
        console.log(response.data.data);  // Log the response data
      } catch (error) {
        console.error(error);
        // Optionally set some error state here
      } finally {
        setLoading(false);  // Set loading to false after the request completes
      }
    };
    fetchRoomDetails();
  }, [id, guests, selectedDates]);

  const postOrder = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8888/api/order`,
        {
          room_id: Number(id),  // Ensure room_id is a number (int64)
          date_start: '2024-12-01',
          date_end: '2024-12-02',
          note: 'This is a note',
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);  // Log the response data
      setIsFloating(false);  // Close the floating modal
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateNights = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Calculate the difference in time (milliseconds)
    const differenceInTime = end.getTime() - start.getTime();
  
    // Convert time difference to days (1 day = 86400000 ms)
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    // If the difference is 0, it means the check-in and check-out are on the same day, so we should count it as 1 night
    return differenceInDays < 1 ? 1 : Math.ceil(differenceInDays);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.getElementById('floatingModal');
      if (modal && !modal.contains(event.target as Node)) {
        setIsFloating(false);  
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <div>Loading room details...</div>;
  if (!roomDetails) return <div>Room not found</div>;  

  return (
    <div className='flex flex-col items-center mt-4'>
      <img
            src="https://files.ayana.com/r/kv-05__E57Hw_3200x0.webp"  
            alt="Ocean View Room"
            width={360}
            height={80}
            className="h-[30rem] rounded-xl w-[55rem] shrink-0 object-cover object-center"
        />
      <div className='grid grid-cols-1 px-6 py-4 md:grid-cols-6 md:gap-x-[4.75rem] md:p-0'>
        <div className='flex flex-col gap-7 md:col-span-4'>
          <hr className="border-gray-400 mt-7 w-40rem"></hr>
          <div className='flex flex-col gap-3 md:gap-4'>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase leading-5 tracking-[0.0375rem] text-gray-800/50 md:text-sm">{roomDetails.type}</p>
              <h2 className="font-ayana text-[2rem] font-bold leading-9 text-gray-800 md:text-4xl">{roomDetails.name}</h2></div>
              <p className="flex items-center gap-2 text-gray-600">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 -960 960 960" 
                  className="h-6 w-6 fill-current">
                  <path d="M38-160v-94q0-35 18-63.5t50-42.5q73-32 131.5-46T358-420t120 14 131 46q32 14 50.5 42.5T678-254v94zm700 0v-94q0-63-32-103.5T622-423q69 8 130 23.5t99 35.5q33 19 52 47t19 63v94zM358-481q-66 0-108-42t-42-108 42-108 108-42 108 42 42 108-42 108-108 42m360-150q0 66-42 108t-108 42q-11 0-24.5-1.5T519-488q24-25 36.5-61.5T568-631t-12.5-79.5T519-774q11-3 24.5-5t24.5-2q66 0 108 42t42 108M98-220h520v-34q0-16-9.5-31T585-306q-72-32-121-43t-106-11-106.5 11T130-306q-14 6-23 21t-9 31zm260-321q39 0 64.5-25.5T448-631t-25.5-64.5T358-721t-64.5 25.5T268-631t25.5 64.5T358-541m0-90">
                  </path>
                </svg>
                <span>Max 3 Adults (0-3 years stays FREE)</span>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 -960 960 960" 
                  className="h-6 w-6 fill-current">
                  <path d="M80-200v-255q0-25 10-47t30-36v-116q0-45 30.5-75.5T226-760h180q22 0 41 10t33 27q14-17 32.5-27t40.5-10h180q45 0 76 30.5t31 75.5v116q20 14 30 36t10 47v255h-60v-80H140v80zm430-355h270v-99q0-20-13.5-33T733-700H550q-17 0-28.5 14T510-654zm-330 0h270v-99q0-18-11.5-32T410-700H226q-19 0-32.5 13.5T180-654zm-40 215h680v-115q0-17-11.5-28.5T780-495H180q-17 0-28.5 11.5T140-455zm680 0H140z">
                  </path>
                </svg>
                <span>King/Twin</span>
              </p>
              <div className="flex flex-col items-start gap-5 text-gray-800">
                <p className="leading-[1.625rem] line-clamp-3 text-lg"> {roomDetails.description} </p>
              </div>
          </div>
          <hr className="border-gray-400 w-40rem"></hr>
        </div>
        <div className='col-span-2 hidden h-fit w-full md:sticky md:top-24 md:mt-7 md:flex'>
          <div className='flex w-full flex-col rounded-xl bg-white p-6 shadow-xl shadow-slate-300 gap-1'>
            <div className='mb-1 flex flex-wrap items-baseline gap-1'>
              <span className='w-[6.25rem] text-base font-normal leading-6 text-gray-700'> Starting from</span>
            </div>
            <div className="flex flex-row items-end justify-start font-sm font-normal text-gray-800/60 gap-1">
              <span className="text-[1.6rem] font-medium leading-8 tracking-[0.018rem] text-gray-800">
                Rp {new Intl.NumberFormat('id-ID').format(roomDetails.base_price)} 
              </span>
              <span className="mb-1 text-base font-normal leading-[1.375rem] text-gray-800/60"> / Night</span>
            </div>
            <div className="font-sm flex flex-col font-normal text-gray-700/60">
            <span>Rp {new Intl.NumberFormat('id-ID').format(roomDetails.base_price * 3) } / 
              <span>3 Night</span>
            </span>
            <span>Total excludes taxes &amp; fees</span>
            </div>
            <button className="inline-flex items-center px-4 py-2.5 justify-center whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none bg-orange-300 focus-visible:ring-gold-700 text-black hover:bg-orange-400 focus:bg-orange-400 mt-7 text-base font-semibold uppercase leading-6 tracking-[0.05rem] shadow-md "onClick={() => setIsFloating(!isFloating)} >
              Order Now
            </button>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 flex justify-center items-center bg-opacity-70 bg-black p-6 transition-opacity ${isFloating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transitionDuration: '300ms' }}
      >
        <div id="floatingModal" className="w-full max-w-3xl p-6 rounded-xl bg-white gap-1">
          <button type="button" className="sticky top-0 z-10 flex w-full items-center gap-4 border-none bg-white p-4 pl-0 shadow-sm" onClick={() => setIsFloating(!isFloating)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" className="h-4 w-4 shrink-0 text-gray-800">
            <path d="M655-80 255-480l400-400 56 57-343 343 343 343z">
            </path>
            </svg>
            <span className="text-base font-medium leading-5 text-gray-800">Back</span>
          </button>
          <div className='flex flex-col'>
            <div className="flex items-center gap-5">
              <div>
                <img 
                  alt="Room View" 
                  loading="lazy" 
                  decoding="async" 
                  src='https://files.ayana.com/r/kv-05__E57Hw_3200x0.webp'
                  className="h-[120px] w-[200px] rounded-lg object-cover object-center"
                  >
                  </img>
                </div>
                <div className="flex flex-col items-start justify-start gap-1 text-gray-800">
                  <p className="text-sm font-semibold leading-5 tracking-[0.044rem] text-gray-800/50">AYANA Komodo Waecicu Beach</p>
                  <h1 className="text-left font-ayana text-3xl font-bold leading-8">1 x Ocean View Room</h1>
                </div>
              </div>
          </div>
          <div className="mt-10 text-gray-800">
            <p className="text-left text-sm font-semibold uppercase leading-6 tracking-[0.044rem] text-gray-800/50">Stay Information</p>
            <p className="border-b border-b-gray-100 py-4 text-left text-sm font-medium leading-5">{formatDate(dates.startDate)} - {formatDate(dates.endDate)} , {calculateNights(dates.startDate, dates.endDate)} Night</p>
            <p className="border-b border-b-gray-100 py-4 text-left text-sm font-medium leading-5">{guestList.rooms} Room · {guestList.adults} Adult</p>
            <div className="border-b bor der-b-gray-100 py-5">
              <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" className="h-5 w-5 shrink-0 fill-current text-red-500">
              <path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150zM480-80q-82 0-155-31.5t-127.5-86-86-127.5T80-480q0-83 31.5-156t86-127T325-848.5 480-880q83 0 156 31.5T763-763t85.5 127T880-480q0 82-31.5 155T763-197.5t-127 86T480-80m0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140m0-340"></path>
              </svg>
              <div className="flex flex-col items-start">
                <p className="text-left text-sm font-medium leading-5">No refund is allowed and no-show will be fully charged</p>
                <p className="text-left text-sm font-normal leading-5 text-gray-800/60">This room booking can't be refunded. If you don't arrive at the property on the check-in date, you will be considered a no-show and will not be given a refund.</p>
              </div>
            </div>
          </div>
          </div>
          <div className='flex w-full flex-col'>
            <div className="pb-5">
              <p className="text-left text-sm font-semibold uppercase leading-5 tracking-[0.038rem] text-gray-800/50">Price Summary</p>
              <div className="flex items-center justify-between gap-3 border-b border-b-gray-100 py-5">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium leading-[1.375rem] text-gray-800">{guestList.rooms} Room x {calculateNights(dates.startDate, dates.endDate)} Night
                  </div>
                </div>
                <div className="text-sm font-medium leading-[1.375rem] text-gray-800">Rp {new Intl.NumberFormat('id-ID').format(roomDetails.base_price * guestList.rooms * calculateNights(dates.startDate, dates.endDate))}
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-b-gray-100 py-5 text-sm font-medium text-gray-800">
                <p className="leading-[1.375rem]">Tax &amp; Fees</p>
                <p className="leading-[1.375rem]">Rp {new Intl.NumberFormat('id-ID').format(roomDetails.base_price * 0.12 * guestList.rooms * calculateNights(dates.startDate, dates.endDate))}</p>
              </div>
              <div className="flex justify-between pt-5 text-sm font-medium text-black">
                  <span className="text-base font-semibold leading-[1.375rem]">Subtotal</span>
                  <span className="text-base font-semibold leading-[1.375rem] text-gold-700">Rp {new Intl.NumberFormat('id-ID').format(roomDetails.base_price*1.12 * guestList.rooms * calculateNights(dates.startDate, dates.endDate))}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => postOrder()} 
            className=" mt-10 mb-5 inline-flex items-center px-4 py-2.5 justify-center whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none bg-orange-300 focus-visible:ring-orange-700 text-black hover:bg-orange-400 focus:bg-orange-400 mt-7 text-base w-full font-semibold uppercase leading-6 tracking-[0.05rem] shadow-md"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
