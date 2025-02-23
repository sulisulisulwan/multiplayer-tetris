import express from 'express'
import { RoomTypes, UserId } from 'multiplayer-tetris-types'
import db from '../db/db.js'
import { gameDb } from '../index.js'
import chalk from 'chalk'
const app = express()
app.use(express.json())



app.get('/game', async(req, res) => {
  const { userId } = req.query
  const game = await gameDb.getGameByUserId(userId as UserId)
  if (game) {
    res.status(200).json({
      ...game.getSocket().getPortAndAddress(),
      gameId: game.getId()
    })
  } else {
    res.status(200).json(null)
  }
}) 

app.post('/game', async(req, res) => {
  try {
    console.log(chalk.cyan('HTTP POST /game') + ' from client')
    const { gameState, userId }= req.body
    const gameId = await gameDb.createGame(userId, gameState)
    const game = await gameDb.getGame(gameId)
    const { address, port } = game.getSocket().getPortAndAddress()
    res.status(201).json({ address, port, gameId })
  } catch(e) {
    console.error(e)
    res.sendStatus(400)
  }
})

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