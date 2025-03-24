/**
 * Rapports quotidiens

Page de saisie pour résumer les observations par patient (ex: "État stable", "Douleurs rapportées").

Export PDF ou impression du rapport de fin de shift.
 */
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_nurse/report-nurse')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_nurse/report-nurse"!</div>
}
