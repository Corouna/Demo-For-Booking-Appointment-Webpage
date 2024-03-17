import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../services/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await deleteDoc(doc(db, "appointments", id as string));
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (e) {
      console.error("Error deleting document: ", e);
      res.status(400).json({ message: `Error deleting booking: ${e.message}` });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
