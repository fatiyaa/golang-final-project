"use client";

import React, { useEffect, useState } from 'react';
import SwiperBookingList from '../components/carrouselMyReservation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const MyReservation = () => {
  const [bookingData, setbookingData] = useState<any[]>([]);
  const [CANCELED, setCANCELED] = useState<any[]>([]);
  const [PENDING, setPENDING] = useState<any[]>([]);
  const [checkedIn, setCheckedIn] = useState<any[]>([]);
  const [checkedOut, setCheckedOut] = useState<any[]>([]);
  const [booked, setBooked] = useState<any[]>([]);
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

          const CANCELED = data.data.Orders.filter((booking: any) => booking.status === 'CANCELED');
          const PENDING = data.data.Orders.filter((booking: any) => booking.status === 'PENDING');
          const checkedIn = data.data.Orders.filter((booking: any) => booking.status === 'CHECKED_IN');
          const checkedOut = data.data.Orders.filter((booking: any) => booking.status === 'CHECKED_OUT');
          const booked = data.data.Orders.filter((booking: any) => booking.status === 'BOOKED');
          
          setCANCELED(CANCELED);
          setPENDING(PENDING);
          setCheckedIn(checkedIn);
          setCheckedOut(checkedOut);
          setBooked(booked);
          setbookingData(data.data.Orders);
          console.log(data.data.Orders);
          console.log(CANCELED);
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

  const statuses = [
    { label: 'Booked Reservation', data: booked , noLabel: 'There is no Booked Reservation' },
    { label: 'Checked In Reservation', data: checkedIn, noLabel: 'There is no Checked In Reservation' },
    { label: 'Pending Reservation', data: PENDING, noLabel: 'There is no Pending Reservation' },
    { label: 'Canceled Reservation', data: CANCELED, noLabel: 'There is no Canceled Reservation' },
    { label: 'Checked Out Reservation', data: checkedOut, noLabel: 'There is no Checked Out Reservation' }
  ];

  return (
      <div className='flex flex-wrap gap-8 py-9 bg-gray-50 dark:bg-gray-900'>
        {statuses.map((status, index) => (
          <div key={index} className='mx-auto lg:w-1/3 flex flex-col justify-start h-[31rem] mb-10'>
            <div>
              <p className='text-2xl dark:text-white py-2 font-bold'>{status.label}</p>
            </div>
            <div className='flex items-center justify-center h-full'>
                {status.data.length === 0 ? (
                    <p className="text-lg  text-gray-400 dark:text-gray-400">{status.noLabel}</p>
                ) : (
                  <SwiperBookingList 
                    bookings={status.data} 
                    updateBookingStatus={updateBookingStatus} 
                    makeNewReservation={makeNewReservation}
                  />
                )}
            </div>
          </div>
        ))}
      </div>
    );
}

export default MyReservation;