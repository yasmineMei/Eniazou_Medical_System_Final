import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_opd/registration')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_opd/registration"!</div>
}
