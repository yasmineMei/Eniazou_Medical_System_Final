import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_appointments/priseAppointment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_appointments/priseAppointment"!</div>
}
