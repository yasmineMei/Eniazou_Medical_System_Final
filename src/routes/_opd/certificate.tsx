import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_opd/certificate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_opd/certificate"!</div>
}
