export const generatePdf = async (data) => {
  try{
    const pdf = await $fetch('/api/pdf/generate', {
      method: 'POST',
      body: data,
      responseType: 'blob'
    })

    const url = URL.createObjectURL(pdf)
    const link = document.createElement('a')
    link.href = url
    link.download = `${data.title}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }catch(error){
    throw error;
  }
}