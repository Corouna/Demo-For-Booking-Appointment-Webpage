import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from './../../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bookingsCol = collection(db, "appointments");
    const bookingSnapshot = await getDocs(bookingsCol);
    const bookingsList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(bookingsList);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}