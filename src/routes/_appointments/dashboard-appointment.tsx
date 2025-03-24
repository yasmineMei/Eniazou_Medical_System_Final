import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_appointments/dashboard-appointment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_appointments/dashboard-appointment"!</div>
}
