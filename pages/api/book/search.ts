import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../services/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchQuery = req.query.query as string;

  if (!searchQuery) {
    return res.status(400).json({ message: 'A search query is required.' });
  }

  try {
    const bookingsRef = collection(db, "appointments");
    const queries = [
      query(bookingsRef, where("email", "==", searchQuery)),
      query(bookingsRef, where("mobile", "==", searchQuery)),
    ];

    const results = await Promise.all(queries.map(q => getDocs(q)));
    const bookings = results.flatMap(result => result.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error searching bookings:", error);
    res.status(500).json({ message: 'Error searching for bookings.' });
  }
}
