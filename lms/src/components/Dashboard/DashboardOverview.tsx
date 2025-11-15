"use client"
import { Card, Col, Row, Statistic } from "antd";
import { BookOutlined, TeamOutlined } from "@ant-design/icons";
import EnrollmentBarChart from "../charts/EnrollmentBarChart";
import CategoryPieChart from "../charts/CategoryPieChart";
import { useEffect, useState } from "react";
import { useStoreState } from "easy-peasy";

interface DashboardOverviewProps {
  user: any;
}
const enrollmentData = [
    { month: "Jan", students: 50 },
    { month: "Feb", students: 120 },
    { month: "Mar", students: 30 },
    { month: "Apr", students: 70 },
    { month: "May", students: 200 },
    { month: "Jun", students: 420 },
    { month: "Jul", students: 500 },
  ];
  const categoryData = [
  { name: "MERN", value: 120 },
  { name: "AI/ML", value: 90 },
  { name: "JAVA ", value: 60 },
  { name: "PYTHON", value: 40 },
];
export default function DashboardOverview({ user }: DashboardOverviewProps) {
  // const User=useStoreState((state: any)=>state.auth.user);
  const [activeStudents, setActiveStudents] = useState<number>(0);
  const [activeInstructors, setActiveInstructors] = useState<number>(0);
  const fetchStudents=async ()=>{
  const token = localStorage.getItem("token");
  const res = await fetch("/api/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data=await res.json()
  const students = data.filter((user: any) => user.role === "user");
  const instructors = data.filter((user: any) => user.role === "instructor");
  setActiveStudents(students.length);
  setActiveInstructors(instructors.length);
  console.log(students);
  console.log(instructors);
}
useEffect(()=>{
  fetchStudents();
},[]);

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your courses today.</p>
      </div>

      <Row gutter={16} style={{ margin: "40px 0px" }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Courses" value={8} prefix={<BookOutlined />} valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Active Students" value={activeStudents} prefix={<TeamOutlined />} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        {user?.role !== "instructor"?<Col span={6}>
          <Card>
            <Statistic title="Active Instructors" value={activeInstructors} prefix={<TeamOutlined />} valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>:<></>}
        
        <Col span={6}>
          <Card>
            <Statistic title="Completion Rate" value={85} suffix="%" valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
      </Row>
    <div style={{display:'flex',gap:'20px'}}>
        <EnrollmentBarChart data={enrollmentData} />
      <CategoryPieChart data={categoryData} />
      </div>
    </>
  );
}
