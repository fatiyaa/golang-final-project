'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { tr } from 'date-fns/locale';
import { set } from 'date-fns';

interface Hotel {
    name: string;
    rating: number;
    address: string;
    city: string;
    phone_number: string;
    email: string;
    description: string;
}


export default function adminpage() {
    const router = useRouter();
    const token = Cookies.get('auth_token');
    const [hotelData, setHotelData] = useState<any[]>([]); 
    const [roomData, setRoomData] = useState<any[]>([]);
    const [userData, setUserData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
    const [createHotel, setCreateHotel] = useState<Hotel>({
        name: "",
        rating: 0,
        address: "",
        city: "",
        phone_number: "",
        email: "",
        description: "", 
    });
    const dropdownRef = useRef<HTMLDivElement | null>(null); 
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isFloating, setIsFloating] = useState(false);
    const [isFloatingAdd, setIsFloatingAdd] = useState(false);



    const fetchHotelData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8888/api/hotel',
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
            if (!response.data) {
                throw new Error('Failed to fetch hotel data');
            }
            const data = response.data;
            console.log(data);
            setHotelData(data.data.Hotels);
        } catch (err) {
            console.error('Error fetching hotel data:', err);
        }
    }

    const fetchRoomData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8888/api/room',
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.data) {
                throw new Error('Failed to fetch room data');
            }

            const data = response.data;
            console.log(data);
            setRoomData(data.data.Rooms);
        } catch (err) {
            console.error('Error fetching room data:', err);
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8888/api/user',
                {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                      },
                  }
              );
              if (!response.data) {
                  throw new Error('Failed to fetch room data');
              }
                const data = response.data;
                console.log(data);
                setUserData(data.data.Users);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    }

    const handleEdit = (id: number) => {
        console.log('Edit hotel:', id);
        const hotel = hotelData.find((h) => h.id === id);
        setSelectedHotel(hotel);
        setDropdownOpen(null);
        setIsFloating(!isFloating);
        // router.push(`/admin/hotel/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
        console.log('Delete hotel:', id);
        try {
            const response = await axios.delete(`http://127.0.0.1:8888/api/hotel/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setHotelData(hotelData.filter(hotel => hotel.id !== id));
            } else {
                throw new Error('Failed to delete hotel');
            }
            setDropdownOpen(null);
            setIsFloating(false);            
            router.refresh();
        } catch (err) {
            console.error('Error deleting hotel:', err);
        }
    };

    const handleEditHotel = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8888/api/hotel/${selectedHotel.id}`, 
                {
                    name: selectedHotel.name,
                    rating: parseFloat(selectedHotel.rating.toString()),
                    address: selectedHotel.address,
                    city: selectedHotel.city,
                    phone_number: selectedHotel.phone_number,
                    email: selectedHotel.email,
                    description: selectedHotel.description,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                const updatedHotel = response.data.data.Hotel;
                setHotelData(hotelData.map(hotel => (hotel.id === updatedHotel.id ? updatedHotel : hotel)));
                setIsFloating(false);
            } else {
                throw new Error('Failed to update hotel');
            }
        } catch (err) {
            console.error('Error updating hotel:', err);
        }
    }

    const toggleDropdown = (id: number) => {
        setDropdownOpen(dropdownOpen === id ? null : id); // Toggle dropdown open/close for specific hotel
    };

    const handleCreateHotel = async (e: React.FormEvent) => {
        try {
            const response = await axios.post('http://127.0.0.1:8888/api/hotel',
                {
                    name: createHotel.name, 
                    rating: parseFloat(createHotel.rating.toString()),
                    address: createHotel.address,
                    city: createHotel.city,
                    phone_number: createHotel.phone_number,
                    email: createHotel.email,
                    description: createHotel.description,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 201) {
                const newHotel = response.data.data.Hotel;
                setHotelData([...hotelData, newHotel]);
                setIsFloatingAdd(false);
            } else {
                throw new Error('Failed to create hotel');
            }
            console.log(response);
        } catch (err) {
            console.error('Error creating hotel:', err);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Hotel) => {
        setCreateHotel({
          ...createHotel,
          [field]: e.target.value,
        });
      };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        const modalOption = document.getElementById('floatingModal');
        if (modalOption && !modalOption.contains(event.target as Node)) {
            setDropdownOpen(null);
        }
        const modalEdit = document.getElementById('floatingEditModal');
        if (modalEdit && !modalEdit.contains(event.target as Node)) {
            setIsFloating(false);
        }
        const modalAdd = document.getElementById('floatingAddModal');   
        if (modalAdd && !modalAdd.contains(event.target as Node)) {
            setIsFloatingAdd(false);
        }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    useEffect(() => {
        if (!token) {
            router.push('/login');
        } else {
            fetchHotelData();
            fetchRoomData();
            fetchUserData();
        }
        
    }, [router]);

  return (
    <div>
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                        <form className="flex items-center">
                            <label htmlFor ="simple-search" className="sr-only">Search</label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required={true}/>
                            </div>
                        </form>
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <button type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" onClick={() => setIsFloatingAdd(!isFloatingAdd)}>
                            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            Add product
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Hotel name</th>
                                <th scope="col" className="px-4 py-3">Address</th>
                                <th scope="col" className="px-4 py-3">Contact</th>
                                <th scope="col" className="px-4 py-3">Email</th>
                                <th scope="col" className="px-4 py-3">Description</th>
                                <th scope="col" className="px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotelData.map((hotel) => (
                                <tr className="border-b dark:border-gray-700" key={hotel.id}>
                                    <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{hotel.name}</th>
                                    <td className="px-4 py-3">{hotel.address}</td>
                                    <td className="px-4 py-3">{hotel.phone_number}</td>
                                    <td className="px-4 py-3">{hotel.email}</td>
                                    <td className="px-4 py-3">{hotel.description}</td>
                                    <td className="px-4 py-3 flex items-center justify-end">
                                        <button onClick={() => toggleDropdown(hotel.id)}
                                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>
                                        {dropdownOpen === hotel.id && (
                                            <div id="floatingModal" className="absolute mt-2 bg-white shadow-lg rounded-lg w-40 right-0 z-10  divide-y divide-gray-100 s dark:bg-gray-700 dark:divide-gray-600">
                                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-center items-center">
                                                    <li>
                                                        <button
                                                            onClick={() => handleEdit(hotel.id)}
                                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 w-[10rem]"
                                                        >
                                                            Edit
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={() => handleDelete(hotel.id)}
                                                            className="block px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-700 w-[10rem]"
                                                        >
                                                            Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </section>
        <div
            className={`fixed inset-0 flex justify-center items-center bg-opacity-70 bg-black p-6 transition-opacity ${isFloating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ transitionDuration: '300ms' }}
        >
          <div className="relative p-4 w-full max-w-2xl h-full md:h-auto" id="floatingEditModal">
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Update Product
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal" onClick={() => setIsFloating(!isFloating)}>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
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
                        <div></div>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={selectedHotel ? selectedHotel.name : ''}
                                onChange={(e) => {
                                    if (selectedHotel) {
                                        setSelectedHotel({
                                            ...selectedHotel,
                                            name: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedHotel ? selectedHotel.name : ''}
                            />
                        </div>
                        <div>
                            <label htmlFor="Rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                            <input
                                type="float"
                                name="Rating"
                                id="Rating"
                                value={selectedHotel ? selectedHotel.rating : ''}
                                onChange={(e) => {
                                    if (selectedHotel) {
                                        setSelectedHotel({
                                            ...selectedHotel,
                                            rating: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedHotel ? selectedHotel.rating : ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="Address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                            <input
                                type="text"
                                value={selectedHotel ? selectedHotel.address : ''}
                                name="Address"
                                id="Address"
                                onChange={(e) => {
                                    if (selectedHotel) {
                                        setSelectedHotel({
                                            ...selectedHotel,
                                            address: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedHotel ? selectedHotel.address : ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                            <input
                                type="text"
                                value={selectedHotel ? selectedHotel.city : ''}
                                name="city"
                                id="city"
                                onChange={(e) => {
                                    if (selectedHotel) {
                                        setSelectedHotel({
                                            ...selectedHotel,
                                            city: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedHotel ? selectedHotel.city : ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                            <input
                                type="text"
                                value={selectedHotel ? selectedHotel.phone_number : ''}
                                name="phone"
                                id="phone"
                                onChange={(e) => {
                                    if (selectedHotel) {
                                        setSelectedHotel({
                                            ...selectedHotel,
                                            phone_number: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedHotel ? selectedHotel.phone_number : ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input
                                type="text"
                                value={selectedHotel ? selectedHotel.email : ''}
                                name="email"
                                id="email"
                                onChange={(e) => {
                                    if (selectedHotel) {
                                        setSelectedHotel({
                                            ...selectedHotel,
                                            email: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedHotel ? selectedHotel.email : ''}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea
                                id="description"
                                value={selectedHotel ? selectedHotel.description : ''}
                                onChange={(e) => {
                                    if (selectedHotel) {
                                        setSelectedHotel({
                                            ...selectedHotel,
                                            description: e.target.value,
                                        });
                                    }
                                }}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedHotel ? selectedHotel.description : ''}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={handleEditHotel}>
                            Update product
                        </button>
                        <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={() => handleDelete(selectedHotel.id)}>
                            <svg className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
        <div
            className={`fixed inset-0 flex justify-center items-center bg-opacity-70 bg-black p-6 transition-opacity ${isFloatingAdd ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ transitionDuration: '300ms' }}
        >
          <div className="relative p-4 w-full max-w-2xl h-full md:h-auto" id="floatingAddModal">
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Create Product
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal" onClick={() => setIsFloatingAdd(!isFloatingAdd)}>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={createHotel.name}
                            onChange={(e) => handleInputChange(e, "name")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter hotel name"
                        />
                        </div>

                        <div>
                        <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Rating
                        </label>
                        <input
                            type="float"
                            name="rating"
                            id="rating"
                            value={createHotel.rating}
                            onChange={(e) => handleInputChange(e, "rating")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="0"
                        />
                        </div>

                        <div>
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Address
                        </label>
                        <input
                            type="text"
                            value={createHotel.address}
                            name="address"
                            id="address"
                            onChange={(e) => handleInputChange(e, "address")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter hotel address"
                        />
                        </div>

                        <div>
                        <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            City
                        </label>
                        <input
                            type="text"
                            value={createHotel.city}
                            name="city"
                            id="city"
                            onChange={(e) => handleInputChange(e, "city")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter city"
                        />
                        </div>

                        <div>
                        <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={createHotel.phone_number}
                            name="phone_number"
                            id="phone_number"
                            onChange={(e) => handleInputChange(e, "phone_number")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter phone number"
                        />
                        </div>

                        <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            value={createHotel.email}
                            name="email"
                            id="email"
                            onChange={(e) => handleInputChange(e, "email")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter email"
                        />
                        </div>

                        <div className="sm:col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={createHotel.description}
                            onChange={(e) => handleInputChange(e, "description")}
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Hotel description"
                        ></textarea>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={handleCreateHotel}>
                            Create product
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    </div>
  );
}
