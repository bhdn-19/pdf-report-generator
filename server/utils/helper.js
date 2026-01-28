import fs from 'fs/promises'

const filePath = 'server/data/pdf.json'

export const readData = async () =>
  JSON.parse(await fs.readFile(filePath, 'utf-8'))

export const writeData = async (data) =>
  fs.writeFile(filePath, JSON.stringify(data, null, 2))
