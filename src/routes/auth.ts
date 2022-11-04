import fetch from 'node-fetch'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'
import { z } from 'zod'
import { prisma } from '../lib/prisma'


export async function authRoutes(fastify: FastifyInstance) {
	
	fastify.get('/me', {
			onRequest: [ authenticate ]
		},
		async (request) => {
			
			return { user: request.user }
		})
	
	// fastify.post('/users', async (request) => {
	//
	// })
	
	fastify.post('/users', async (request) => {

		const createUserBody = z.object({
			access_token: z.string()
		})
		const { access_token } = createUserBody.parse(request.body)


		//TODO: Validate access_token
		//TODO: try/catch

		const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		})

		const userData = await userResponse.json()

		const userInfoShema = z.object({
			id: z.string(),
			email: z.string().email(),
			name: z.string(),
			picture: z.string().url()
		})

		// ya29.a0Aa4xrXMQK25g7dvkm5COcMw5cwCpsNQ3t98v-JNFc6kpxGMXev_VPwz5CpoKvxSPLLho1tfRqMYjgT-QeZEtDtrYe3FCtkgHT3Jabnw2yzD_jTk-tkELyiN7MZs2dm_h8i1zQhYUW31Pz70Z4J2UAy1bZWnFMgaCgYKAS4SARISFQEjDvL9xb-IFcDEuUCchXOykpd4TQ0165

		const userInfo = userInfoShema.parse(userData)

		let user = await prisma.user.findUnique({
			where:{
				googleId: userInfo.id,
			}

		})
		if(!user){
			user = await prisma.user.create({
				data: {
					googleId: userInfo.id,
					email: userInfo.email,
					name: userInfo.name,
					avatarUrl: userInfo.picture
				}
			})
		}

		const token = fastify.jwt.sign({
			name: user.name,
			avatarUrl: user.avatarUrl
		},{
			expiresIn: '7 days',
			sub: user.id
		})

		return { token }
	})
	
}