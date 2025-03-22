import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_opd/birth-registration')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_opd/birth-registration"!</div>
}
