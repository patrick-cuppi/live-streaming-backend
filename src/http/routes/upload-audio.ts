import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      // const { roomId } = request.params
      const audio = await request.file()

      if (!audio) {
        return reply.status(400).send({ message: 'Missing file' })
      }
    }
  )
}
