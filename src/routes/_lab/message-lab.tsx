import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_lab/message-lab')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_lab/message-lab"!</div>
}
