"use client";

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import necessary Swiper modules
import { Navigation, Pagination } from 'swiper/modules';

const images = [
    'https://files.ayana.com/r/kv-01_tzhxlQ_3200x0.webp',
    'https://files.ayana.com/r/kv-02_VoyjOw_3200x0.webp',
    'https://files.ayana.com/r/kv-03_mj-2wA_3200x0.webp',
    'https://files.ayana.com/r/kv-04_q63pkQ_3200x0.webp',
    'https://files.ayana.com/r/kv-06_7Q5wxg_3200x0.webp',
    'https://files.ayana.com/r/kv-08_GJnD4A_3200x0.webp',
    'https://files.ayana.com/r/kv-07_sTvHlA_3200x0.webp',
    'https://files.ayana.com/r/kv-05__E57Hw_3200x0.webp',
    'https://files.ayana.com/r/kv-09_DbdsLg_3200x0.webp',
    
];

export default function ImageCarousel() {
    // Create a ref for the Swiper instance
    const swiperRef = useRef<null>(null);

    return (
        <div className="w-full h-screen relative">
            {/* Custom circular navigation buttons with border */}
            <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 border-4x border-white rounded-full opacity-80 hover:opacity-100 z-10 flex justify-center items-center"
                onClick={() => swiperRef.current?.swiper.slidePrev()}
            >
            </button>

            <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 border-4 border-white rounded-full opacity-80  hover:opacity-100 z-10 flex justify-center items-center"
                onClick={() => swiperRef.current?.swiper.slideNext()}
            >
            </button>

            <Swiper
                spaceBetween={10}
                navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                pagination={{ clickable: true }}
                loop
                modules={[Navigation, Pagination]}
                className="w-full h-full"
                ref={swiperRef}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="flex justify-center items-center">
                        <img
                            src={image}
                            alt={`Carousel Image ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
