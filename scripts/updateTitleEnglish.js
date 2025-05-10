const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const allRecommendations = await prisma.recommendation.findMany()
    let updatedCount = 0

    for (const rec of allRecommendations) {
        const cached = await prisma.animeCache.findUnique({
            where: { animeId: rec.animeId }
        })

        if (cached?.titleEnglish && cached.titleEnglish !== rec.title) {
            await prisma.recommendation.update({
                where: { id: rec.id },
                data: { titleEnglish: cached.titleEnglish }
            })
            updatedCount++
        }
    }

    console.log(`✅ ${updatedCount} recommandations mises à jour avec titleEnglish.`)
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e)
    })
    .finally(() => {
        prisma.$disconnect()
    })
