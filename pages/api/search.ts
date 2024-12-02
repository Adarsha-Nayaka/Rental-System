import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb'; // Adjust the import path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (typeof query !== 'string') {
    return res.status(400).json({ results: [] });
  }

  try {
    // Fetch listings that match the query (case-insensitive search)
    const results = await prisma.listing.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageSrc: true,
        price: true,
        securityDeposit: true,
      },
      take: 10, // Limit to 10 recommendations
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
