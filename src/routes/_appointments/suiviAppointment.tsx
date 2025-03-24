import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_appointments/suiviAppointment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_appointments/suiviAppointment"!</div>
}
