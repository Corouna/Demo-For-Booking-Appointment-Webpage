// pages/api/book.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { sendEmail } from '@/services/mail';
import { formatICSDate } from '@/utils/dateFormatter'; 

interface Data {
  id?: string;
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      const { email, date, time } = req.body;
      const docRef = await addDoc(collection(db, "appointments"), req.body);

      // Generate .ics file content
      const startDate = new Date(`${date}T${time}:00`); 
      const endDate = new Date(startDate.getTime() + 60 * 60000);
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        'SUMMARY:Your Appointment',
        `DESCRIPTION:Your appointment is confirmed on ${date} at ${time}.`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const mailOptions = {
        to: email,
        subject: 'Appointment Confirmation',
        text: `Your appointment has been booked successfully on ${req.body.date}, at ${req.body.time}`, 
        icsContent
      };

      await sendEmail(mailOptions);
      res.status(200).json({ id: docRef.id });
    } catch (e) {
      res.status(400).json({ message: 'Failed to book the appointment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
