"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { day: "Mon", tickets: 22, resolved: 15 },
  { day: "Tue", tickets: 31, resolved: 24 },
  { day: "Wed", tickets: 28, resolved: 22 },
  { day: "Thu", tickets: 42, resolved: 33 },
  { day: "Fri", tickets: 37, resolved: 29 },
  { day: "Sat", tickets: 19, resolved: 16 },
  { day: "Sun", tickets: 25, resolved: 20 },
];

export default function TicketTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Trends</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tickets"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}