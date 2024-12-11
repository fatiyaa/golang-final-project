"use client";

import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import necessary Swiper modules
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

const imagesNumbered = {
  1: 'https://files.ayana.com/r/kv-01_tzhxlQ_3200x0.webp',
  2: 'https://files.ayana.com/r/kv-02_VoyjOw_3200x0.webp',
  3: 'https://files.ayana.com/r/kv-03_mj-2wA_3200x0.webp',
  4: 'https://files.ayana.com/r/kv-04_q63pkQ_3200x0.webp',
  5: 'https://files.ayana.com/r/kv-05__E57Hw_3200x0.webp',
  6: 'https://files.ayana.com/r/kv-06_7Q5wxg_3200x0.webp',
  7: 'https://files.ayana.com/r/kv-07_sTvHlA_3200x0.webp',
  8: 'https://files.ayana.com/r/kv-08_GJnD4A_3200x0.webp',
  9: 'https://files.ayana.com/r/kv-09_DbdsLg_3200x0.webp',
};

// Function to render stars
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const fullStarsArray = new Array(fullStars).fill('★');
  const halfStarsArray = new Array(halfStar).fill('☆');
  const emptyStarsArray = new Array(emptyStars).fill('☆');

  return [...fullStarsArray, ...halfStarsArray, ...emptyStarsArray].join(' ');
};

export default function HotelCarousel() {
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotelData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8888/api/hotel');

      if (!response.data) {
        throw new Error('Failed to fetch hotel data');
      }

      const data = response.data;
      setHotelData(data.data.Hotels);
      setLoading(false); // Set loading to false once data is fetched
    } catch (err) {
      console.error('Error fetching hotel data:', err);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  return (
    <div className="w-full h-full relative">
      <Swiper
        slidesPerView={4}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="w-full h-full flex items-center justify-center"
      >
        {hotelData.map((hotel: any) => (
          <SwiperSlide key={hotel.id} className="flex justify-center items-center my-10">
            <div className="lg:w-[24rem] h-2/3 bg-gray-100 rounded-3xl flex flex-col justify-between shadow-xl">
              <div className="bg-black rounded-3xl">
                {/* Correct image source access */}
                <img
                  src={imagesNumbered[hotel.id]}
                  className="h-[450px] w-full rounded-t-3xl object-cover object-center"
                  alt={`Hotel image for ${hotel.id}`}
                />
              </div>
              <div className="py-5 flex flex-col mx-3 gap-4">
                <div>
                  <h1 className="uppercase font-bold text-[1.3rem]">{hotel.name}</h1>
                  <p className="text-[0.9rem] font-semibold">{hotel.address} · {hotel.city}</p>
                  <p className="text-[0.9rem] font-semibold">Rating: {renderStars(hotel.rating)} {hotel.rating}</p>
                </div>
                <div>
                  <p className="text-[1.1rem]">{hotel.description}</p>
                </div>
                <div>
                  <p className="text-[0.9rem] font-semibold">Contact:</p>
                  <p className="text-[0.9rem] font-semibold">Email: {hotel.email}</p>
                  <p className="text-[0.9rem] font-semibold">Phone: {hotel.phone_number}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
