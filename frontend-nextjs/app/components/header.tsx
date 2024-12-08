'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header({ isFixed }: { isFixed: boolean }) {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control dropdown menu

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const role = Cookies.get('role');
    if (token) {
      setHasToken(true);
      if (role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, [router]);

  const handleLogout = () => {
    // Clear the auth token from cookies and redirect to login page
    Cookies.remove('auth_token');
    setHasToken(false);
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <header
      className={`${
        isFixed ? 'fixed top-0 left-0 right-0 z-50' : ''
      } transition-all bg-white shadow-md`}
    >
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="https://flowbite.com" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </a>
          {!hasToken ? (
            <div className="flex items-center lg:order-2">
              <a
                href="/login"
                className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-600"
              >
                Sign up
              </a>
            </div>
          ) : (
            <div className="flex items-center lg:order-2 relative">
              {/* Avatar button that toggles the menu */}
              <button
                className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu visibility on click
              >
                <img
                  src="https://www.w3.org/assets/website-2021/svg/avatar.svg"
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute top-9 right-0 mt-2 w-48 bg-white shadow-lg rounded-b-lg border dark:bg-gray-800 dark:border-gray-700 z-50">
                  <ul className="py-2">
                    <li>
                      <a
                        href="/myreservation"
                        className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        My Reservation
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a
                  href="/"
                  className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/hotel"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Hotel
                </a>
              </li>
              <li>
                <a
                  href="/reservation"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Reservation
                </a>
              </li>
              {hasToken && (
                <li>
                  <a
                    href="/myreservation"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    My Reservation
                  </a>
                </li>
              )}
              {isAdmin && (
                <li>
                  <a
                    href="/admindashboard"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Admin Dashboard
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
