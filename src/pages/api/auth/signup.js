import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: 'Username already taken' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
