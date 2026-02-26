import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const PORT = Number(process.env.SERVER_PORT) || 5000
  const HOST = process.env.SERVER_HOST || '0.0.0.0'
  const CLIENT_URL = process.env.CLIENT_URL || '*'

  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  })

  await app.listen(PORT, HOST)

  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
}

bootstrap()