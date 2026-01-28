import { readData } from "~~/server/utils/helper"

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  const data = await readData()
  
  return data.find(t => t.id === id)
})