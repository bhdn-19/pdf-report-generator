import { readData, writeData } from "~~/server/utils/helper"

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  const body = await readBody(event)
  const data = await readData()
  const i = data.findIndex(t => t.id === id)
  
  data[i] = {...data[i], ...body}

  await writeData(data)
  return data[i]
})