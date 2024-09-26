import express from 'express'
import { cookie, google, signin, signout, signup } from '../controllers/auth.controllers.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/signout', signout)
router.post('/google', google)
router.get('/cookie', cookie)

export default router