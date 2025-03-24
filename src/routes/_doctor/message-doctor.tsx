import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_doctor/message-doctor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_doctor/message-doctor"!</div>
}
