
export const uploadImage = async (file: File, dynasty: string) => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('dynasty', dynasty)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  return response.json()
}

export const generateImage = async (imageId: string, dynasty: string) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageId, dynasty })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Generation failed')
  }
  
  return response.json()
}
