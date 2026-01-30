
export const uploadImage = async (file: File, dynasty: string) => {
  const formData = new FormData()
  // Important: Append fields before the file to ensure they are available to Multer's storage engine
  formData.append('dynasty', dynasty)
  formData.append('image', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  return response.json()
}

export const generateOneShot = async (file: File, dynasty: string, gender: string, role: string, keepBackground: boolean) => {
  const formData = new FormData()
  formData.append('dynasty', dynasty)
  formData.append('gender', gender)
  formData.append('role', role)
  formData.append('keepBackground', String(keepBackground))
  formData.append('image', file)
  
  const response = await fetch('/api/generate-one-shot', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Generation failed')
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
