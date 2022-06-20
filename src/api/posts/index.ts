import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  switch (req.method) {

    // 如果对这个路径发起 POST 请求，代表他想要注册一个账号
    case 'GET':
      try {

        // 建立一个 Prisma 客户端，他可以帮助我们连线到数据库
        const prisma = new PrismaClient();

        const posts = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        });

        // 把建立成功的用户数据（不包含密码）和 JWT 回传给前端
        res.status(200)
          .json({ data: posts })

        // 处理完请求以后记得断开数据库链接
        await prisma.$disconnect();

      } catch (e: any) {
        // 如果发生未预期的错误，将对应的错误说明的 Prisma 文档发给用户
        res.status(500).json({
          result: false,
          message: typeof e.code === 'string' ? 'https://www.prisma.io/docs/reference/api-reference/error-reference#' + e.code.toLowerCase() : e
        })
      }
      break;
    default:
      // 如果不是 POST 请求，代表他正在用错误的方式访问这个 API
      res.status(405).json({ error: 'Method not allowed' })
  }
}