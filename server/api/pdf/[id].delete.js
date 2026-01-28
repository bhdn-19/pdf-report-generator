import { readData, writeData } from "~~/server/utils/helper"

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  const data = await readData()

  await writeData(data.filter(t => t.id !== id))
  return { success: "ok" }
})