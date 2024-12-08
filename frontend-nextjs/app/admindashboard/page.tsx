'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import HotelTable from '../components/admin/hoteltable.tsx'; 
import RoomTable from '../components/admin/roomtable.tsx';



export default function adminpage() {
    const router = useRouter();
    const token = Cookies.get('auth_token');
    const [hotelOrRoom, setSelectedKeys] = useState<string[]>(["hotel"]);

    const selectedValue = useMemo(
      () => Array.from(hotelOrRoom).join(", ").replace(/_/g, ""),
      [hotelOrRoom],
    );

    useEffect(() => {
        if (!token) {
            router.push('/login');
        } else {

        }
    }, []);



  return (
    <div>
    {selectedValue === "hotel" && (
        <HotelTable 
            hotelOrRoom={hotelOrRoom}
            setSelectedKeys={setSelectedKeys}
          />
    )}
    {selectedValue === "room" && (
        <RoomTable
          hotelOrRoom={hotelOrRoom} 
          setSelectedKeys={setSelectedKeys}
        />
    )}
  </div>
  );
}
