import express from 'express'
import db from '../db/db'
import { RoomTypes } from 'multiplayer-tetris-types'
const app = express()

app.get('/rooms', async (req, res) => {
  const roomType = req.query.roomType as RoomTypes

  if (!roomType) {
    const roomsData = await db.getAllRooms()
    res.status(200).json(roomsData)
    return
  }
  
  const roomsData = await db.getRoomByType(roomType)
  res.status(200).json(roomsData)
})

app.get('/users', async (req, res) => {
  if (req.query.userId) {
    const userData = await db.getUserById(req.query.userId.toString())
    res.status(200).json(userData)
    return
  }
  const usersData = await db.getAllUsers()
  res.status(200).json(usersData)
})



export default app