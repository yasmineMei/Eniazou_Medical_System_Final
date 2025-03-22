import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/nurse/nurse')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/nurse/nurse"!</div>
}
