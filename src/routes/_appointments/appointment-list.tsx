import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_appointments/appointment-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_appointments/doctor-appointment-list"!</div>
}
