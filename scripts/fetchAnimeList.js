import fs from "fs"
import axios from "axios"

const fetchAllAnime = async () => {
    let all = []

    for (let page = 1; page <= 20; page++) { // jusqu’à 500 animes
        try {
            const res = await axios.get("https://api.jikan.moe/v4/anime", {
                params: {
                    limit: 25,
                    page: page,
                    order_by: "score",
                    sort: "desc"
                }
            })
            all.push(...res.data.data)
            await new Promise((r) => setTimeout(r, 1100)) // éviter le 429
        } catch (err) {
            console.error("Erreur à la page", page, err.message)
            break
        }
    }

    fs.writeFileSync("data/animeCache.json", JSON.stringify(all, null, 2), "utf-8")
    console.log(`✅ ${all.length} animes sauvegardés.`)
}

fetchAllAnime()
