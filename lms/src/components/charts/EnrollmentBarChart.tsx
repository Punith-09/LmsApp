"use client";

import { Card } from "antd";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";

interface ChartData {
  month: string;
  students: number;
}

export default function EnrollmentBarChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="rounded-2xl shadow-md" title="Students Enrollment Over Time" bordered={false} style={{width:'50%'}}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ borderRadius: "12px", backgroundColor: "#fff", border: "1px solid #ddd" }}
          />
          <Bar dataKey="students" fill="#4f46e5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
