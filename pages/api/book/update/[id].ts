import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from './../../../../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { sendEmail } from '@/services/mail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const docRef = doc(db, "appointments", id as string);
      await updateDoc(docRef, req.body);

      const mailOptions = {
        to: req.body.email,
        subject: 'Appointment Confirmation',
        text: `Your appointment has been updated successfully to a new date on ${req.body.date}, at a new time ${req.body.time}`, 
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