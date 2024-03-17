import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import { format, addBusinessDays, isWithinInterval, addWeeks, startOfDay, parseISO } from 'date-fns';
import { Appointment, Booking } from '@/data/interface';

const BookAppointmentForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const minDate = addBusinessDays(new Date(), 2);
  const maxDate = addWeeks(new Date(), 3);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const router = useRouter();
  const { edit, id } = router.query;

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour < 18; hour++) { 
        const amPm = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour > 12 ? hour - 12 : hour;
        const formattedHour = adjustedHour < 10 ? `0${adjustedHour}` : adjustedHour;
        options.push(`${formattedHour}:00 ${amPm}`);
        if (hour < 17) { 
            options.push(`${formattedHour}:30 ${amPm}`);
        }
    }

    options.push(`05:30 PM`);
    return options.map((time, index) => (
        <option key={index} value={time}>{time}</option>
    ));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const appointment: Appointment = {
      name,
      email,
      mobile,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      time: selectedTime,
    };

    if (isEditMode && bookingId){
      updateHandler(appointment);
    } else {
      createHandler(appointment)
    }
  };

  const updateHandler = async (appointment: Appointment) => {
    try {
      const response = await fetch(`/api/book/update/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (response.ok) {
        alert('Booking updated successfully');
        router.push('/');
      } else {
        alert('Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking');
    }
  }

  const createHandler = async (appointment: Appointment) => {
    try {
      const response = await fetch('/api/book/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      alert('Appointment booked successfully');
      router.push('/');
    } catch (error) {
      console.error('Error booking the appointment:', error);
      alert('Failed to book the appointment');
    }
  }

  const handleReturn = () => {
    router.push('/'); 
  };

  useEffect(() => {
    const fetchBooking = async (): Promise<void> => {
      if (typeof id === 'string' && edit) {
        setIsEditMode(true);
        const response = await fetch(`/api/book/${id}`);
        const booking: Booking = await response.json();
        setName(booking.name);
        setMobile(booking.mobile);
        setEmail(booking.email);
        setSelectedDate(parseISO(booking.date));
        setSelectedTime(booking.time);
        setBookingId(id);
      }
    };

    fetchBooking();
  }, [edit, id]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          {isEditMode ? 'Edit Your Booking' : 'Book an Appointment'}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                required
                className="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium leading-5 text-gray-700">Appointment Date</label>
              <div className="mt-1">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => setSelectedDate(date)}
                  minDate={minDate}
                  maxDate={maxDate}
                  filterDate={(date) => {
                    const isWeekday = date.getDay() !== 0 && date.getDay() !== 6;
                    return isWeekday && isWithinInterval(date, { start: startOfDay(minDate), end: maxDate });
                  }}
                  dateFormat="MMMM d, yyyy"
                  wrapperClassName="w-full"
                  className="w-full px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm" 
                />
              </div>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium leading-5 text-gray-700">Appointment Time</label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-white shadow-sm border border-gray-300 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm"
              >
                <option value="">Select a time</option>
                {generateTimeOptions()}
              </select>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleReturn}
                className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-gray-300 text-base leading-6 font-medium text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:border-gray-400 focus:shadow-outline-gray transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
                Return
              </button>
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
                {isEditMode ? 'Update Booking' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentForm;
