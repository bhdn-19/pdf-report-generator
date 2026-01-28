import { readData } from "~~/server/utils/helper"

export default defineEventHandler(async () => {
  const data = await readData()
  return data.reverse()
})