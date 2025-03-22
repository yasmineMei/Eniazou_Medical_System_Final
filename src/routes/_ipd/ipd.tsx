import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/ipd')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_ipd/ipd"!</div>
}
