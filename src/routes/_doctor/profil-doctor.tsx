import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_doctor/profil-doctor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_doctor/profil-doctor"!</div>
}
