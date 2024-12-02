"use client";

import React, { useEffect, useState } from 'react';  // Add this import
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const MyReservation = () => {
    const [bookingData, setbookingData] = useState<any[]>([]);
    const router = useRouter();
    const token = Cookies.get('auth_token');

    const fetchbookingData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8888/api/order/user', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' } 
            });

            if (!response.data) {
                throw new Error('Failed to fetch booking data');
            }

            const data = response.data;
            setbookingData(data.data.Orders);
            console.log(data.data.Orders);
        } catch (err) {
            console.error('Error fetching booking data:', err);
        }
    }
    

    useEffect(() => {
        console.log(token);

        if (!token) {
            router.push('/login');
        } else {
            fetchbookingData();
        }
    }, [router]);

    const updateBookingStatus = async (id: number, status: string) => {

        try {
            const response = await axios.put(`http://127.0.0.1:8888/api/order/${id}/${status}`, {
                status: status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data) {
                throw new Error('Failed to update booking status');
            }

            const data = response.data;
            console.log(data);
            fetchbookingData();
            router.refresh();
        } catch (err) {
            console.error('Error updating booking status:', err);
        }
    }

    const makeNewReservation = () => {
        router.push('/reservation');
    }

    return (
        <div className='bg-gray-50 dark:bg-gray-900 mb-10'>
            <div className=' mx-auto lg:w-2/3 justify-center items-center'>
                <h1>My Reservation</h1>
                <div className='flex flex-wrap items-center w-full gap-5 justify-center'>
                    {bookingData.map((booking) => (
                        <div key={booking.id} className='max-w-3xl bg-white rounded-t-lg rounded-b-md flex flex-col gap-1 shadow-lg max-w-[20rem] h-[27rem]'>
                            <img 
                                src="https://files.ayana.com/r/kv-09_DbdsLg_3200x0.webp" 
                                alt="" 
                                width={360}
                                height={80}
                                className="h-[5rem] rounded-t-lg w-[20rem] shrink-0 object-cover object-center mb-3"
                            />
                            <div className='flex flex-col px-3 my-2 gap-1 h-full'>
                                <div className='flex flex-row items-stretch font-semibold mb-1'>
                                    {booking.status === 'BOOKED' ? (
                                        <div className='text-green-500'>BOOKED</div>
                                    ) : booking.status === 'PENDING' ? (
                                        <div className='text-yellow-500'>PENDING</div>
                                    ) : booking.status === 'CHECKED_IN' ? (
                                        <div className='text-blue-400'>CHECKED IN</div>
                                    ) : booking.status === 'CHECKED_OUT' ? (
                                        <div className='text-blue-800'>CHECKED OUT</div>
                                    ) : (
                                        <div className='text-red-500'>CANCELLED</div>
                                    )}
                                </div>
                                <div className='text-2xl font-semibold uppercase leading-5 tracking-[0.0375rem] text-gray-900 '>{booking.hotel_name}</div>
                                <div className='font-bold -mb-2 text-gray-700 text-base'>{booking.room_name}</div>
                                <div className='mb-4 font-semibold text-gray-600 text-base'>x Rooms • x Adults</div>
                                <div className='flex flex-col h-full justify-between'>
                                    <div>

                                        <div className='flex items-center -ml-1'>
                                            <img 
                                                src="https://cdn-icons-png.flaticon.com/512/1247/1247000.png"
                                                alt="Email Icon" 
                                                width="25" 
                                                height="22" 
                                                style={{ marginRight: '8px' }} // Adding a small gap between the icon and text
                                            />
                                        <span> : {booking.date_start}, 12:00</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <img 
                                                src="https://cdn-icons-png.flaticon.com/512/1286/1286853.png"
                                                alt="Email Icon" 
                                                width="22" 
                                                height="22" 
                                                style={{ marginRight: '8px' }} // Adding a small gap between the icon and text
                                            />
                                        <span> : {booking.date_end}, 10:00</span>
                                        </div>
                                        <div className='-ml-1'>Total : Rp {new Intl.NumberFormat('id-ID').format(booking.price * 1.12)}</div>

                                        <div>note : {booking.note}</div>
                                    </div>
                                    {/* if booking.status == BOOKED */}
                                    <div className='flex flex-row  mb-2'>
                                        {booking.status === 'BOOKED' ? (
                                            <button className='bg-blue-600 text-white w-full py-2 px-4 rounded-xl shadow-xl cursor-pointer hover:bg-blue-700' onClick={() => updateBookingStatus(booking.id, 'CHECKED_IN')}>
                                                <p className='font-bold tracking-[0.2rem]'>CHECKIN NOW</p>
                                            </button>
                                        ) : booking.status === 'CANCELED' ? (
                                            <div className="flex items-start gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" className="h-5 w-5 shrink-0 fill-current text-red-500">
                                                <path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150zM480-80q-82 0-155-31.5t-127.5-86-86-127.5T80-480q0-83 31.5-156t86-127T325-848.5 480-880q83 0 156 31.5T763-763t85.5 127T880-480q0 82-31.5 155T763-197.5t-127 86T480-80m0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140m0-340"></path>
                                                </svg>
                                                <div className="flex flex-col items-start">
                                                    <p className="text-left text-sm font-medium leading-5">No refund is allowed, further information please contact customer services</p>
                                                </div>
                                            </div>
                                        ) : booking.status === 'PENDING' ? (
                                            <div className='text-yellow-500 justify-center flex flex-col w-full'>
                                              PENDING - Waiting for confirmation
                                              <div className='flex flex-row gap-2'>
                                                <button className='mt-1 bg-red-600 text-white w-full px-4 rounded-xl shadow-xl cursor-pointer hover:bg-red-700 font-bold tracking-[0.0rem] uppercase'  onClick={() => updateBookingStatus(booking.id, 'CANCELED')}>
                                                    Cancel
                                                </button>
                                                <button className='mt-1 bg-green-600 text-white w-full py-2 px-4 rounded-xl shadow-xl cursor-pointer hover:bg-green-700 font-bold tracking-[0.0rem] uppercase'  onClick={() => updateBookingStatus(booking.id, 'BOOKED')}>
                                                    Confirm
                                                </button>
                                              </div>
                                            </div>
                                          ) : booking.status === 'CHECKED_IN' ? (
                                            <button className='bg-red-600 text-white w-full py-2 px-4 rounded-xl shadow-xl cursor-pointer hover:bg-red-700' onClick={() => updateBookingStatus(booking.id, 'CHECKED_OUT')}>
                                              <p className='font-bold tracking-[0.2rem]'>CHECKOUT NOW</p>
                                            </button>
                                          ) : booking.status === 'CHECKED_OUT' ? (
                                            <div className='text-blue-800 w-full'>
                                              <button className='mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-xl hover:bg-blue-700 font-bold tracking-[0.04rem]' onClick={makeNewReservation}>
                                                Make Another Reservation
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="flex items-start gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" className="h-5 w-5 shrink-0 fill-current text-red-500">
                                                <path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150zM480-80q-82 0-155-31.5t-127.5-86-86-127.5T80-480q0-83 31.5-156t86-127T325-848.5 480-880q83 0 156 31.5T763-763t85.5 127T880-480q0 82-31.5 155T763-197.5t-127 86T480-80m0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140m0-340"></path>
                                                </svg>
                                                <div className="flex flex-col items-start">
                                                    <p className="text-left text-sm font-medium leading-5">No refund is allowed, further information please contact customer services</p>
                                                </div>
                                            </div>
                                          )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyReservation;