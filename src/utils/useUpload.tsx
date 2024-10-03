import {useState} from 'react'
import axios from 'axios'
import {Buffer} from 'buffer'
import RNFS from 'react-native-fs'
import {useGetSignedUrl} from 'services/src/profile'
import ImageResizer from 'react-native-image-resizer'

export const useUpload = (onUpload?: (fileName: string) => void) => {
  const {triggerGetSignedUrl} = useGetSignedUrl()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getSignedUrl = async fileName => {
    try {
      const response = await triggerGetSignedUrl(fileName)
      return response.data.data
    } catch (error) {
      console.log('error get url: ', error)
    }
  }

  const upload = async (url, selectedImage) => {
    try {
      const base64Image = await RNFS.readFile(selectedImage.uri, 'base64')
      const binaryData = Buffer.from(base64Image, 'base64')
      const response = await axios.put(url, binaryData, {
        headers: {
          'Content-Type': selectedImage.type,
        },
      })
      return response
    } catch (error) {
      console.log('error upload: ', error)
    }
  }

  const uploadImage = async imageUrl => {
    console.log('uploadImage', imageUrl)
    try {
      setLoading(true)
      let resizedImage = {uri: imageUrl, type: 'image/jpeg'}
      let quality = 80
      let fileSize = await RNFS.stat(resizedImage.uri).then(
        statResult => statResult.size,
      )

      while (fileSize > 50 * 1024) {
        quality -= 10
        resizedImage = await ImageResizer.createResizedImage(
          imageUrl,
          800,
          800,
          'JPEG',
          quality,
        )
        fileSize = await RNFS.stat(resizedImage.uri).then(
          statResult => statResult.size,
        )
      }
      // const fileType = resizedImage.type.split('/')[1]
      const fileType = 'jpeg'
      const fileName = `sales/orders/${new Date().getTime()}.${fileType}`
      const url = await getSignedUrl(fileName)
      const responseS3 = await upload(url, resizedImage)
      if (responseS3?.status === 200) {
        onUpload?.(fileName)
        return fileName
      }
    } catch (err) {
      console.error('Error uploading image: ', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  return {uploadImage}
}

export default useUpload
