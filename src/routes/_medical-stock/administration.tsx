import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_medical-stock/administration')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_medical-stock/administration"!</div>
}
