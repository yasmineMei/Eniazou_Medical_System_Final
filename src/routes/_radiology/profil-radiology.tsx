import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_radiology/profil-radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_radiology/profil-radiology"!</div>
}
