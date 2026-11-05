import express from 'express'
import {getme} from '../controller/user.controller.js'

const router = express.Router()

router.get('/me', getme)

export default router