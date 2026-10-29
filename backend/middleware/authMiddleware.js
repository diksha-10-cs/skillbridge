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
      const secret = process.env.JWT_SECRET
      if (!secret || !secret.trim()) {
        throw new Error('JWT_SECRET environment variable is not configured.')
      }
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

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }

  return res.status(403).json({
    success: false,
    message: 'Forbidden: Administrator access required.',
  })
}
