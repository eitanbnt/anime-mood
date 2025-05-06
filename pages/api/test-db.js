import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  try {
    const all = await prisma.recommendation.findMany()
    res.status(200).json({ success: true, count: all.length })
  } catch (e) {
    console.error("Erreur Prisma/Vercel :", e)
    res.status(500).json({ error: e.message })
  }
}