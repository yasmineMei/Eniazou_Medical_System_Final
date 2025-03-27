import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_lab/profil-lab')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_lab/profil-lab"!</div>
}
