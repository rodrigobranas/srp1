import dotenv from 'dotenv'
import { createApp } from './app'

dotenv.config()

const port = Number(process.env.PORT) || 3000
const app = createApp()

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
