import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/lab/lab')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/lab/lab"!</div>
}
