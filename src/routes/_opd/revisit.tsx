import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_opd/revisit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_opd/revisit"!</div>
}
