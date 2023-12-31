import { pusherServer } from '@/lib/pusher'

export async function POST(req: Request) {
  const { sourceCode, projectId } = await req.json()
  pusherServer.trigger(projectId, 'project-message', sourceCode)
  return new Response(JSON.stringify({ success: true }))
}