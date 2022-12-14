import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { poolRoutes } from './routes/pool'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'


async function bootstrap() {
	const fastify = Fastify({
		logger: true
	})
	
	await fastify.register(cors, {
		origin: true,
		methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
		allowedHeaders: [ 'Content-Type', 'Authorization' ]
	})
	// em produçaõ usar uma chave secreta no .env
	await fastify.register(jwt, {
		secret: 'supersecret'
	})
  
	
	await fastify.register(authRoutes)
	await fastify.register(poolRoutes)
	await fastify.register(userRoutes)
	await fastify.register(gameRoutes)
	await fastify.register(guessRoutes)

	
	
	await fastify.listen({
		port: 3333,
		host: '0.0.0.0'
	})
}

bootstrap()