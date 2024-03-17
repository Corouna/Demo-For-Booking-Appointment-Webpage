import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from './../../../../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { sendEmail } from '@/services/mail';
import { formatICSDate } from '@/utils/dateFormatter'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { email, date, time } = req.body;
      const docRef = doc(db, "appointments", id as string);
      await updateDoc(docRef, req.body);

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
        text: `Your appointment has been updated successfully to a new date on ${req.body.date}, at a new time ${req.body.time}`, 
        icsContent
      };

      await sendEmail(mailOptions);

      res.status(200).json({ message: 'Booking updated successfully' });
    } catch (e) {
      console.error("Error updating document: ", e);
      res.status(400).json({ message: `Error updating booking: ${e.message}` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}