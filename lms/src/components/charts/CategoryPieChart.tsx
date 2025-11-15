"use client";

import { Card } from "antd";
import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer,Legend,} from "recharts";

const COLORS = ["#4f46e5", "#22c55e", "#0ea5e9", "#f97316"];

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export default function CategoryPieChart({ data }: { data: CategoryData[] }) {
  return (
    <Card className="rounded-2xl shadow-md" title="Students by Category" bordered={false} style={{width:'50%'}}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: "12px", backgroundColor: "#fff", border: "1px solid #ddd" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
