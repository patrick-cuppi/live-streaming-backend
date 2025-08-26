import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateEmbeddings, transcribeAudio } from '../../services/gemini.ts'

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
      const { roomId } = request.params
      const audio = await request.file()

      if (!audio) {
        return reply.status(400).send({ message: 'Missing file' })
      }

      const audioBuffer = await audio.toBuffer()
      const audioAsBase64 = audioBuffer.toString('base64')

      const transcription = await transcribeAudio(audioAsBase64, audio.mimetype)

      const embeddings = await generateEmbeddings(transcription)

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning()

      const chunk = result[0]

      if (!chunk) {
        return reply.status(500).send({ message: 'Failed to create chunk' })
      }

      return reply.status(201).send({ chunkId: chunk.id })
    }
  )
}
