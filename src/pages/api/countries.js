import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, isoCode, status, countryName } = req.body;

    if (!userId || !isoCode || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      let country = await prisma.country.findUnique({
        where: {
          userId_isoCode: {
            userId: parseInt(userId),
            isoCode: isoCode,
          },
        },
      });

      if (country) {
        country = await prisma.country.update({
          where: { id: country.id },
          data: { status: status },
        });
        return res.status(200).json(country);
      } else {
        const newCountry = await prisma.country.create({
          data: {
            userId: Number(userId),
            isoCode: isoCode,
            status: status,
            name: countryName,
          },
        });
        return res.status(201).json(newCountry);
      }
    } catch (error) {
      console.error('Error adding/updating country:', error);
      return res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  else if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    try {
      const countries = await prisma.country.findMany({
        where: { userId: Number(userId) },
      });
      return res.status(200).json(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      return res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  else if (req.method === 'PUT') {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing id or status' });
    }

    try {
      const updatedCountry = await prisma.country.update({
        where: { id: Number(id) },
        data: { status },
      });
      return res.status(200).json(updatedCountry);
    } catch (error) {
      console.error('Error updating country:', error);
      return res.status(500).json({ error: 'Server error', details: error.message });
    }
  }

  else if (req.method === 'DELETE') {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }
  
    try {
      await prisma.country.delete({
        where: { id: Number(id) },
      });
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting country:', error);
      return res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
  

  else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
