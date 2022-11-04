import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function gameRoutes(fastify: FastifyInstance) {
	
	fastify.get('/games/count', async () => {
		const count = await prisma.game.count()
		return { count }
	})
	
	//lista de jogos do bolão
	
	fastify.get('/pools/:id/games', {}, async (request, reply) => {
		const getPoolParams = z.object({
			id: z.string()
		})
		const { id } = getPoolParams.parse(request.params)
		
		const games = await prisma.game.findMany({
			orderBy: {
				date: 'desc'
			},
			include:{
				guesses: {
					where:{
						participant: {
							userId: request.user.sub,
							poolId: id
						}
					}
				}
			}
			
		})
		
		return {
			games: games.map(game =>{
				return {
					...game,
					guess: game.guesses.length > 0 ? game.guesses[0] : null,
					guesses: undefined
				}
			})
		}
		
		
	})
}
