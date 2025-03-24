import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_opd/dayCare')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_opd/dayCare"!</div>
}
