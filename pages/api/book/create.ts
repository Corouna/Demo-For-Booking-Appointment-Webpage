// pages/api/book.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { sendEmail } from '@/services/mail';

interface Data {
  id?: string;
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      const docRef = await addDoc(collection(db, "appointments"), req.body);
      const mailOptions = {
        to: req.body.email,
        subject: 'Appointment Confirmation',
        text: `Your appointment has been booked successfully on ${req.body.date}, at ${req.body.time}`, 
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
