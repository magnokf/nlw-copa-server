import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	const user =  await prisma.user.create({
		  data: {
			  name: 'Magno Felipe',
			  email: 'jd@email.com',
			  avatarUrl: 'https://avatars.githubusercontent.com/u/24296039?s=400&u=8548b6c4026bf8ded1af8dab1356261cc6158eb1&v=4',

		  }
	  })
	
	const pool = await prisma.pool.create({
		data: {
			title: 'Pool 1',
			code: 'BOL123',
			ownerId: user.id,
			participants: {
				create:{
					userId: user.id
				}
			}
		}
	})
	
	await prisma.game.create({
		data: {
			date: new Date(),
			TeamAContrycode: 'BR',
			TeamBContrycode: 'AR',
		}
	})
	
	await prisma.game.create({
		data: {
			date: new Date(),
			TeamAContrycode: 'BR',
			TeamBContrycode: 'DE',
			
			guesses: {
				create: {
					scoreTeamA: 1,
					scoreTeamB: 2,
					participant:{
						connect: {
							poolId_userId:{
								poolId: pool.id,
								userId: user.id
							}
						}
					}
					
				}
			}
		}
	
	
	})
}

main()