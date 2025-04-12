import { createFileRoute } from "@tanstack/react-router";
import {  Users, Stethoscope, ClipboardList } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// Mock data for the chart
const chartData = [
  { browser: "safari", visitors: 200, fill: "#FFA500" },
  { month: "Janvier", rendezVous: 186 },
  { month: "Fevrier", rendezVous: 305 },
  { month: "Mars", rendezVous: 237 },
  { month: "Avril", rendezVous: 73 },
  { month: "Mai", rendezVous: 209 },
  { month: "Juin", rendezVous: 214 },
];



// Chart configuration for the line chart
const chartConfig2 = {
  rendezVous: {
    label: "Rendez-vous",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/_home/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      {/* Grid of cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        
        

        {/* Patients Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="items-center pb-0">
            <Users className="h-8 w-8 text-[#018a8cff]" />
            <CardTitle>Patients</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <p className="text-center text-xl font-bold">10</p>
            <p className="text-center text-muted-foreground">
              Patients enregistrés
            </p>
          </CardContent>
        </Card>

        {/* Doctors Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="items-center pb-0">
            <Stethoscope className="h-8 w-8 text-[#018a8cff]" />
            <CardTitle>Médecins</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <p className="text-center text-xl font-bold">5</p>
            <p className="text-center text-muted-foreground">
              Médecins enregistrés
            </p>
          </CardContent>
        </Card>

        {/* Nurses Card */}
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardHeader className="items-center pb-0">
            <Stethoscope className="h-8 w-8 text-[#018a8cff]" />
            <CardTitle>Infirmier</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <p className="text-center text-xl font-bold">8</p>
            <p className="text-center text-muted-foreground">
              Infirmier enregistrés
            </p>
          </CardContent>
        </Card>

        {/* Administrative Staff Card */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="items-center pb-0">
            <ClipboardList className="h-8 w-8 text-[#018a8cff]" />
            <CardTitle>Personnel Administratif</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <p className="text-center text-xl font-bold">1</p>
            <p className="text-center text-muted-foreground">
              Personnel administratif enregistrés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-4">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-Vous</CardTitle>
            <CardDescription>Janvier - Juin 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig2}>
              <LineChart
                width={800}
                height={400}
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="rendezVous"
                  type="monotone"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
