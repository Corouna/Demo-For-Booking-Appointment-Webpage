import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from './../../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Booking ID is required' });
  }

  const docRef = doc(db, "appointments", id as string);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    res.status(200).json(docSnap.data());
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
}