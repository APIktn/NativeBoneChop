import { PrismaService } from '../prisma/prisma.service'

export async function generateUserCode(
  prisma: PrismaService,
): Promise<string> {

  const now = new Date()

  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')

  const prefix = `USR${yyyy}${mm}${dd}`

  const lastUser = await prisma.user.findFirst({
    where: {
      UserCode: {
        startsWith: prefix,
      },
    },
    orderBy: {
      UserCode: 'desc',
    },
  })

  let running = 1

  if (lastUser) {
    running = parseInt(lastUser.UserCode.slice(-4)) + 1
  }

  return `${prefix}${String(running).padStart(4, '0')}`
}
