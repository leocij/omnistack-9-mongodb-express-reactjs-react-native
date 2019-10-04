import axios from 'axios'
import { AsyncStorage } from 'react-native'

const base_url = 'http://192.168.100.6:3333'
AsyncStorage.setItem('base_url', base_url)

export default axios.create({
  baseURL: base_url
})