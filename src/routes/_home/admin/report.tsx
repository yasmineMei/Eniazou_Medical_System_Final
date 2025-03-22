"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Données fictives pour les rapports
const reportData = {
  stats: [
    { title: "Patients totaux", value: "1,234", change: "+5.2%", icon: "👤" },
    { title: "Revenus totaux", value: "€56,789", change: "+12.3%", icon: "💰" },
    { title: "Services utilisés", value: "345", change: "+8.7%", icon: "🏥" },
    {
      title: "Taux de satisfaction",
      value: "92%",
      change: "+2.1%",
      icon: "⭐",
    },
  ],
  revenueData: [
    { month: "Jan", revenue: 4000 },
    { month: "Fév", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Avr", revenue: 6000 },
    { month: "Mai", revenue: 4500 },
    { month: "Juin", revenue: 7000 },
  ],
  serviceDistribution: [
    { name: "Consultation", value: 400 },
    { name: "Radiologie", value: 300 },
    { name: "Chirurgie", value: 200 },
    { name: "Laboratoire", value: 100 },
  ],
  patientData: [
    { id: 1, name: "Jean Dupont", service: "Consultation", revenue: "50 €" },
    { id: 2, name: "Marie Martin", service: "Radiologie", revenue: "120 €" },
    { id: 3, name: "Paul Durand", service: "Chirurgie", revenue: "200 €" },
  ],
};

export const Route = createFileRoute("/_home/admin/report")({
  component: ReportsPage,
});

function ReportsPage() {
  const [period, setPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("revenue");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Rapports</h1>

      {/* Filtres */}
      <div className="flex gap-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Journalier</SelectItem>
            <SelectItem value="monthly">Mensuel</SelectItem>
            <SelectItem value="yearly">Annuel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de rapport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenus</SelectItem>
            <SelectItem value="patients">Patients</SelectItem>
            <SelectItem value="services">Services</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-[#018a8cff] hover:bg-[#016a6cff]">
          Exporter (PDF)
        </Button>
        <Button variant="outline">Exporter (Excel)</Button>
      </div>

      {/* Statistiques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportData.stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">
                {stat.change} ce mois-ci
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#018a8c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition des services</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.serviceDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#018a8c"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des données */}
      <Card>
        <CardHeader>
          <CardTitle>Données brutes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Revenu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.patientData.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.service}</TableCell>
                  <TableCell>{patient.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
