import express from 'express'
import { verifyToken, adminOnly } from '../middleware/auth.js'
import { getAllContent, getContent, updateContent } from '../controllers/contentController.js'
const router = express.Router()
router.get('/', verifyToken, adminOnly, getAllContent)
router.get('/:key', getContent)
router.put('/:key', verifyToken, adminOnly, updateContent)
export default router
