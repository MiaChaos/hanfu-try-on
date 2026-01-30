import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

export const STORAGE_BASE = process.env.VERCEL ? '/tmp' : process.cwd()
export const UPLOADS_DIR = path.join(STORAGE_BASE, 'uploads')
export const GENERATED_DIR = path.join(STORAGE_BASE, 'generated')

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_VERCEL = !!process.env.VERCEL
