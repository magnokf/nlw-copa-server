import { FastifyInstance } from 'fastify'
import { z } from 'zod'


export async function authRoutes(fastify: FastifyInstance) {
	
	fastify.post('/users', async (request, reply) => {
		
		const createUserBody = z.object({
			access_token: z.string()
		})
		const { access_token } = createUserBody.parse(request.body)
		
		const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
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
		
		const userInfo = userInfoShema.parse(userData)
		
		return { userInfo }
	})
	
}