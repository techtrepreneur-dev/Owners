import express from "express"
import { getAuthUser, signIn, signUp } from "../controllers/authControllers.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/user", getAuthUser)

export default router