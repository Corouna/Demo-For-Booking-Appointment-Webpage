import Link from 'next/link';
import { useState } from 'react';
import './index.module.css';
import { Booking } from '@/data/interface';

const HomePage = (): JSX.Element => {
  const [search, setSearch] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);

  const handleSearch = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) { 
      event.preventDefault();
    }
    
    const response = await fetch(`/api/book/search?query=${encodeURIComponent(search)}&timestamp=${new Date().getTime()}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    const data = await response.json();
    setBookings(data || []);
  };
  
  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await fetch(`/api/book/delete/${id}`, { method: 'DELETE' });
      handleSearch();
    }
  };

  return (
    <div className="main">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Welcome to the Appointment Booking System
          </h1>
        </div>
      </header>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form onSubmit={(e) => handleSearch(e)}>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search by Email or Mobile
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      placeholder="Enter email or mobile number"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-5 px-4 py-5 bg-white space-y-6 sm:p-6">
        <span className="inline-flex rounded-md shadow-sm">
          <Link href="/book">
            <p className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Book an Appointment
            </p>
          </Link>
        </span>
      </div>
      {
        bookings.length > 0 &&
        <div className="flex flex-col mt-8 px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="p-2 font-small">{booking.name}</td>
                        <td className="p-2 font-small">{booking.email}</td>
                        <td className="p-2 font-small">{booking.mobile}</td>
                        <td className="p-2 font-small">{booking.date}</td>
                        <td className="p-2 font-small">{booking.time}</td>
                        <td className="flex flex-row items-center justify-start space-x-2 md:space-x-4 p-2 font-small">
                        <Link href={`/book?edit=true&id=${booking.id}`}>
                            <p className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-600 rounded-md mr-2">
                              Edit
                            </p>
                          </Link>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 rounded-md"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

  );
};

export default HomePage;
