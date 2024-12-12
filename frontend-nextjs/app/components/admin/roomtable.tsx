'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { tr } from 'date-fns/locale';
import { set } from 'date-fns';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

interface Hotel {
    name: string;
    type: string;
    capacity: number;
    base_price: number;
    hotel_id: number;
    description: string;
}

interface RoomTable {
    hotelOrRoom: string[];
    setSelectedKeys: (value: string[]) => void;
}


const RoomTable: React.FC<RoomTable> = ({
    hotelOrRoom,
    setSelectedKeys,
}) => {
    const router = useRouter();
    const token = Cookies.get('auth_token');
    const [roomData, setRoomData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [createRoom, setCreateRoom] = useState<Hotel>({
        name: '',
        type: '',
        capacity: 0,
        base_price: 0,
        hotel_id: 0,
        description: '',
    });
    const [isFloating, setIsFloating] = useState(false);
    const [isFloatingAdd, setIsFloatingAdd] = useState(false);
    const [hotelData, setHotelData] = useState<any[]>([]);

    const selectedValue = useMemo(
      () => Array.from(hotelOrRoom).join(", ").replace(/_/g, ""),
      [hotelOrRoom],
    );

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

    const handleEdit = (id: number) => {
        console.log('Edit room:', id);
        const room = roomData.find((h) => h.id === id);
        setSelectedRoom(room);
        console.log(selectedRoom);
        setDropdownOpen(null);
        setIsFloating(!isFloating);
    };

    const handleDelete = async (id: number) => {
        console.log('Delete room:', id);
        try {
            const response = await axios.delete(`http://127.0.0.1:8888/api/room/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setRoomData(roomData.filter(room => room.id !== id));
            } else {
                throw new Error('Failed to delete room');
            }
            setDropdownOpen(null);
            setIsFloating(false);            
            router.refresh();
        } catch (err) {
            console.error('Error deleting room:', err);
        }
    };

    const handleEditRoom = async (e: React.FormEvent) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8888/api/room/${selectedRoom.id}`, 
                {
                    name: selectedRoom.name,
                    type: selectedRoom.type,
                    capacity: Number(selectedRoom.capacity),
                    base_price: Number(selectedRoom.base_price),
                    hotel_id: selectedRoom.hotel_id,
                    description: selectedRoom.description,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                const updatedRoom = response.data.data.Hotel;
                setRoomData(roomData.map(hotel => (hotel.id === updatedRoom.id ? updatedRoom : hotel)));
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

    const handleCreateRoom = async (e: React.FormEvent) => {
        try {
            const response = await axios.post('http://127.0.0.1:8888/api/room',
                {
                    name: createRoom.name,
                    type: createRoom.type,
                    capacity: Number(createRoom.capacity),
                    base_price: Number(createRoom.base_price),
                    hotel_id: createRoom.hotel_id,
                    description: createRoom.description,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 201) {
                const newRoom = response.data.data.Room;
                setRoomData([...roomData, newRoom]);
                setIsFloatingAdd(false);
            } else {
                throw new Error('Failed to create room');
            }
            console.log(response);
        } catch (err) {
            console.error('Error creating room:', err);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Hotel) => {
        setCreateRoom({
          ...createRoom,
          [field]: e.target.value,
        });
      };

    const handleHotelChange = (keys: string[]) => {
        const selectedHotelId = keys.currentKey;
    
    
        setCreateRoom({
            ...createRoom,
            hotel_id: Number(selectedHotelId),
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
            fetchRoomData();
            fetchHotelData();
        }
        
    }, [router]);

  return (
    <div>
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 flex items-center justify-between space-x-3">
                        <Dropdown className='bg-white dark:bg-gray-800'>
                            <DropdownTrigger>
                                <Button className="capitalize rounded-lg shadow shadow-lg bg-gray-300" variant="bordered">
                                {selectedValue}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Single selection example"
                                selectedKeys={hotelOrRoom}
                                selectionMode="single"
                                variant="flat"
                                onSelectionChange={setSelectedKeys}
                            >
                                <DropdownItem key="hotel">Hotel</DropdownItem>
                                <DropdownItem key="room">Room</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" onClick={() => setIsFloatingAdd(!isFloatingAdd)}>
                                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                </svg>
                                Add room
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Room name</th>
                                    <th scope="col" className="px-4 py-3">Type</th>
                                    <th scope="col" className="px-4 py-3">Hotel Name</th>
                                    <th scope="col" className="px-4 py-3">Base Price</th>
                                    <th scope="col" className="px-4 py-3">Description</th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomData.map((room) => (
                                    <tr className="border-b dark:border-gray-700" key={room.id}>
                                        <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{room.name}</th>
                                        <td className="px-4 py-3">{room.type}</td>
                                        <td className="px-4 py-3">{room.hotel_name}</td>
                                        <td className="px-4 py-3">{room.base_price}</td>
                                        <td className="px-4 py-3">{room.description}</td>
                                        <td className="px-4 py-3 flex items-center justify-end">
                                            <button onClick={() => toggleDropdown(room.id)}
                                                    className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </button>
                                            {dropdownOpen === room.id && (
                                                <div id="floatingModal" className="absolute mt-2 bg-white shadow-lg rounded-lg w-40 right-0 z-50  divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600">
                                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200 flex flex-col justify-center items-center">
                                                        <li>
                                                            <button
                                                                onClick={() => handleEdit(room.id)}
                                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 w-[10rem]"
                                                            >
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => handleDelete(room.id)}
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
                        Update room
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateroomModal" onClick={() => setIsFloating(!isFloating)}>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <form action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div className='sm:col-span-2 flex justify-center items-center'>
                            <img 
                                alt="Room View" 
                                loading="lazy" 
                                decoding="async" 
                                src={selectedRoom?.image_url}
                                className="h-[120px] w-[200px] rounded-lg object-cover object-center"
                            >
                            </img>
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={selectedRoom ? selectedRoom.name : ''}
                                onChange={(e) => {
                                    if (selectedRoom) {
                                        setSelectedRoom({
                                            ...selectedRoom,
                                            name: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedRoom ? selectedRoom.name : ''}
                            />
                        </div>
                        <div>
                            <label htmlFor="Type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                            <input
                                type="text"
                                name="Type"
                                id="Type"
                                value={selectedRoom ? selectedRoom.type : ''}
                                onChange={(e) => {
                                    if (selectedRoom) {
                                        setSelectedRoom({
                                            ...selectedRoom,
                                            rating: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedRoom ? selectedRoom.type : ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="Capacity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Capacity</label>
                            <input
                                type="number"
                                value={selectedRoom ? selectedRoom.capacity : ''}
                                name="Capacity"
                                id="Capacity"
                                onChange={(e) => {
                                    if (selectedRoom) {
                                        setSelectedRoom({
                                            ...selectedRoom,
                                            address: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedRoom ? selectedRoom.capacity : ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="basePrice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Base Price</label>
                            <input
                                type="text"
                                value={selectedRoom ? selectedRoom.base_price : ''}
                                name="basePrice"
                                id="basePrice"
                                onChange={(e) => {
                                    if (selectedRoom) {
                                        setSelectedRoom({
                                            ...selectedRoom,
                                            city: e.target.value,
                                        });
                                    }
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedRoom ? selectedRoom.base_price : ''}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <Dropdown className='bg-white dark:bg-gray-800'>
                                <DropdownTrigger>
                                    <Button className="capitalize rounded-lg shadow shadow-l bg-gray-50" variant="bordered">
                                    {selectedRoom && hotelData.find((hotel) => hotel.id === selectedRoom.hotel_id)?.name || 'Select hotel'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Single selection"
                                    selectionMode="single"
                                    variant="flat"
                                    onSelectionChange={ (key) => {
                                        if (selectedRoom) {
                                            setSelectedRoom({
                                                ...selectedRoom,
                                                hotel_id: Number(key.currentKey),
                                            });
                                        }
                                    }}
                                >
                                    {hotelData.map((hotel) => (
                                        <DropdownItem key={hotel.id}>{hotel.name}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea
                                id="description"
                                value={selectedRoom ? selectedRoom.description : ''}
                                onChange={(e) => {
                                    if (selectedRoom) {
                                        setSelectedRoom({
                                            ...selectedRoom,
                                            description: e.target.value,
                                        });
                                    }
                                }}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder={selectedRoom ? selectedRoom.description : ''}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={handleEditRoom}>
                            Update room
                        </button>
                        <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={() => handleDelete(selectedRoom.id)}>
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
                        Create room
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateroomModal" onClick={() => setIsFloatingAdd(!isFloatingAdd)}>
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
                            value={createRoom.name}
                            onChange={(e) => handleInputChange(e, "name")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter room name"
                        />
                        </div>

                        <div>
                        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Type
                        </label>
                        <input
                            type="text"
                            name="type"
                            id="type"
                            value={createRoom.type}
                            onChange={(e) => handleInputChange(e, "type")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter type"
                        />
                        </div>

                        <div>
                        <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Capacity
                        </label>
                        <input
                            type="text"
                            value={createRoom.capacity}
                            name="capacity"
                            id="capacity"
                            onChange={(e) => handleInputChange(e, "capacity")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter city"
                        />
                        </div>

                        <div>
                        <label htmlFor="base_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Base Price
                        </label>
                        <input
                            type="number"
                            value={createRoom.base_price}
                            name="base_price"
                            id="base_price"
                            onChange={(e) => handleInputChange(e, "base_price")}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Enter phone number"
                        />
                        </div>

                        <div>
                        <label htmlFor="hotelId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Hotel ID
                        </label>
                            <Dropdown className='bg-white dark:bg-gray-800'>
                                <DropdownTrigger>
                                    <Button className="capitalize rounded-lg shadow shadow-l bg-gray-50" variant="bordered">
                                    {hotelData.find((hotel) => hotel.id === createRoom.hotel_id)?.name || 'Select hotel'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Single selection"
                                    selectionMode="single"
                                    variant="flat"
                                    onSelectionChange={(key) => handleHotelChange(key)}
                                >
                                    {hotelData.map((hotel) => (
                                        <DropdownItem key={hotel.id}>{hotel.name}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div className="sm:col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={createRoom.description}
                            onChange={(e) => handleInputChange(e, "description")}
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="room description"
                        ></textarea>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={handleCreateRoom}>
                            Create room
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    </div>
  );
};

export default RoomTable