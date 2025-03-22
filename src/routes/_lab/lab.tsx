import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_lab/lab')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_lab/lab"!</div>
}
