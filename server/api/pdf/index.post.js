import { readData, writeData } from "~~/server/utils/helper"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = await readData()
  
  const newGenerate = { id: Date.now(), ...body }
  data.push(newGenerate)

  await writeData(data)
  return newGenerate
})