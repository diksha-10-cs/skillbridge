import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const secret = process.env.JWT_SECRET || 'skillbridge_jwt_secret_key_2026_academic_secure'
      const decoded = jwt.verify(token, secret)

      const user = await User.findById(decoded.id).select('-password')
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User account not found.',
        })
      }

      req.user = user
      return next()
    } catch (error) {
      console.error('JWT Verification Error:', error.message)
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token.',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided.',
    })
  }
}
