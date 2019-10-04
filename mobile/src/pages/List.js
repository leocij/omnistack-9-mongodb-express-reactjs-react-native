import React, { useState, useEffect } from 'react'
import socketIoClient from 'socket.io-client'
import { SafeAreaView, ScrollView, StyleSheet, Image, AsyncStorage, Platform, TouchableOpacity, Text, Alert } from 'react-native'

import SpotList from '../components/SpotList'

import logo from '../assets/logo.png'

export default function List() {
  const [techs, setTechs] = useState([])
  const [baseUrl, setBaseUrl] = useState([])

  useEffect(() => {

    loadBaseUrl()
    async function loadBaseUrl() {
      setBaseUrl(await AsyncStorage.getItem('base_url'))
    }

    AsyncStorage.getItem('user').then(user_id => {
      const socket = socketIoClient(baseUrl, {
        query: { user_id }
      })

      socket.on('booking_response', booking => {
        Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`)
      })
    })

  })

  useEffect(() => {
    AsyncStorage.getItem('techs').then(storagedTechs => {
      const techsArray = storagedTechs.split(',')
        .map(tech => tech.trim())
      setTechs(techsArray)
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <ScrollView>
        {techs.map(tech => <SpotList key={tech} tech={tech} />)}
      </ScrollView>
      
      <TouchableOpacity onPress={() => {
        AsyncStorage.clear()
        navigation.navigate('Login')
      }} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: 'center',
    marginTop: 10,
  },
  button: {
    height: 32,
    backgroundColor: '#F05A5B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 15
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15
  }
})