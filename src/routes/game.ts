import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'

export async function gameRoutes(fastify: FastifyInstance){
	
	fastify.get('/games/count', async () => {
		const count = await prisma.game.count();
		return { count };
	})
	
}

