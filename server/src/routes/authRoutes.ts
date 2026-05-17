import express from "express"
import { changePassword, getAuthUser, GoogleSignIn, manualSignIn, saveEmailVerificationLinkToken, saveForgetPasswordToken, signUp, verifyEmailVerificationToken, verifyForgetPasswordToken } from "../controllers/authControllers.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/manual-signin", manualSignIn)
router.post("/google-signin", GoogleSignIn)
router.post("/email/save-verification-token", saveEmailVerificationLinkToken)
router.post("/email/verify-email-verification-token", verifyEmailVerificationToken)

router.post("/email/save-forget-password-token", saveForgetPasswordToken)
router.post("/email/verify-forget-password-token", verifyForgetPasswordToken)
router.post("/change-password", changePassword)
router.post("/user", authMiddleware, getAuthUser)

export default router