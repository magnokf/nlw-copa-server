import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'
import { z } from 'zod'

export async function guessRoutes(fastify: FastifyInstance) {
	
	fastify.get('/guesses/count', async () => {
		const count = await prisma.guess.count()
		return { count }
	})
	
	//lista de palpites do usuário
	
	fastify.post('/pools/:poolId/games/:gameId/guesses', {
		onRequest: [ authenticate ]
	}, async (request, reply) => {
		const createGuessParams = z.object({
			poolId: z.string(),
			gameId: z.string()
		})
		
		const createGuessBody = z.object({
			scoreTeamA: z.number(),
			scoreTeamB: z.number()
		})
		
		const { poolId, gameId } = createGuessParams.parse(request.params)
		const { scoreTeamA, scoreTeamB } = createGuessBody.parse(request.body)
		
		const participant = await prisma.participant.findUnique({
			where: {
				poolId_userId: {
					userId: request.user.sub,
					poolId
				}
			}
		})
		if (!participant) {
			return reply.status(404).send({
				message: 'Error: Not Allowed'
			})
		}
		
		const guess = await prisma.guess.findUnique({
			where: {
				gameId_participantId: {
					gameId,
					participantId: participant.id
				}
				
			}
		})
		
		if (guess) {
			return reply.status(400).send({
				message: 'Error: Already exists'
			})
		}
		
		const game = await prisma.game.findUnique({
			where: {
				id: gameId
			}
		})
		
		if (!game) {
			return reply.status(404).send({
				message: 'Error: Not Found'
			})
		}
		if (game.date < new Date()) {
			return reply.status(400).send({
				message: 'Error: Game already started'
			})
		}
		
		const newGuess = await prisma.guess.create({
			data: {
				scoreTeamA,
				scoreTeamB,
				participantId: participant.id,
				gameId
			}
		})
		
		return reply.status(201).send({})
	})
}



