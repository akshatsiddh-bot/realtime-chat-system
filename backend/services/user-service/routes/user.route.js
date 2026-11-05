import express from 'express'
import {getme,createProfile} from '../controller/user.controller.js'
import authmiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/me', authmiddleware, getme)

router.post("/internal/create-profile", createProfile);

export default router