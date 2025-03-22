import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_opd/queue')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_opd/queue"!</div>
}
