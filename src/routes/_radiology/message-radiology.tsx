import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_radiology/message-radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_radiology/message-radiology"!</div>
}
