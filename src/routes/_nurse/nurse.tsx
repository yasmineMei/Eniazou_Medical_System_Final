import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_nurse/nurse')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_nurse/nurse"!</div>
}
