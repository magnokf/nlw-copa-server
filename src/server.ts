import Fastify from 'fastify'
import cors from '@fastify/cors'
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
  
  // async function serverRoutes(){
  //   poolRoutes(fastify);
  //   gameRoutes(fastify);
  //   guessRoutes(fastify);
  //   userRoutes(fastify);
  //   authRoutes(fastify);
  // }
await Promise.all([
	fastify.register(authRoutes),
	fastify.register(poolRoutes),
	fastify.register(userRoutes),
	fastify.register(gameRoutes),
	fastify.register(guessRoutes)
])
	
	
	await fastify.listen({
		port: 3333,
		host: '0.0.0.0'
	})
}

bootstrap()