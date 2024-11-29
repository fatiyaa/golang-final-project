import CalendarPopup from './CalendarPopup';
import GuestSelector from './GuestSelector';

export default function RoomSelector() {
  const onSearch = () => {
    console.log('Search button clicked');
  }
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex-shrink-0">
          {/* Add logo or title here */}
          Your Logo
        </h1>
        
        {/* Date and Guest Selector */}
        <div className="flex items-center space-x-4">
          {/* Tanggal (Calendar Popup) */}
          <CalendarPopup />
          
          {/* Guest Selector */}
          <GuestSelector />
        </div>

        {/* Search Button */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500">
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
