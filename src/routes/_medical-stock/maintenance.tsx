import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_medical-stock/maintenance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_medical-stock/maintenance"!</div>
}
