import { createFileRoute } from "@tanstack/react-router";
import { IdCard, Users, Stethoscope, ClipboardList } from "lucide-react";
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
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

// Chart configuration
const chartConfig = {
  visitors: {
    label: "Patients",
  },
  safari: {
    label: "Safari",
    color: "#FFA500",
  },
} satisfies ChartConfig;

// Chart configuration for the line chart
const chartConfig2 = {
  rendezVous: {
    label: "Rendez-vous",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/_home/admin/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      {/* Grid of cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {/* Users Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="items-center pb-0">
            <IdCard className="h-8 w-8 text-[#018a8cff]" />
            <CardTitle>Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0 mt-[-25px]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[140px]"
            >
              <RadialBarChart
                width={300}
                height={300}
                data={chartData}
                startAngle={0}
                endAngle={250}
                innerRadius={40}
                outerRadius={70}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[46, 34]}
                />
                <RadialBar dataKey="visitors" background cornerRadius={10} />
                <PolarRadiusAxis
                  tick={false}
                  tickLine={false}
                  axisLine={false}
                />

                {/* Texte SVG au centre */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-xl font-bold"
                >
                  {chartData[0].visitors.toLocaleString()}
                </text>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm mt-[-40px]">
            <div className="leading-none text-muted-foreground">
              Comptes créés
            </div>
          </CardFooter>
        </Card>

        {/* Patients Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="items-center pb-0">
            <Users className="h-8 w-8 text-[#018a8cff]" />
            <CardTitle>Patients</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <p className="text-center text-xl font-bold">56</p>
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
