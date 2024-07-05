export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }
  try {
    const today = new Date()
    const url = `https://www.nytimes.com/svc/wordle/v2/${formatDate(today)}.json`
    const response = await fetch(url)
    const data = await response.json()
    res.status(200).send(data)
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}
