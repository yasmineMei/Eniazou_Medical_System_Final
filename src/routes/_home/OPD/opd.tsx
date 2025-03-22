import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/OPD/opd')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/OPD/opd"!</div>
}
