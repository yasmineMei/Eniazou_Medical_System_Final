import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_appointments/doctor-leave')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_appointments/doctor-leave"!</div>
}
