import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_opd/vaccin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_opd/vaccin"!</div>
}
