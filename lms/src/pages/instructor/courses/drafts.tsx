"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Spin, Empty, Typography, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useRouter } from "next/router";
import { useStoreActions, useStoreState } from "easy-peasy";
import { toast } from "react-toastify";

const { Title } = Typography;

export default function InstructorDraftsPage() {
  const router = useRouter();
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
  const isLoading = useStoreState((state: any) => state.loading.isLoading);

  const [courses, setCourses] = useState<any[]>([]);

  const fetchPendingCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const pendingCourses = data.courses.filter((c: any) => c.status === "pending");
        setCourses(pendingCourses);
      } else {
        toast.error(data.message || "Failed to fetch drafts");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Draft deleted");
        fetchPendingCourses();
      } else {
        toast.error(data.message || "Failed to delete draft");
      }
    } catch (err) {
      toast.error("Error deleting draft");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="2-2"
          onSelect={(key) => {
            if (key === "1") router.push("/instructor/dashboard");
            if (key === "2-1") router.push("/instructor/courses/courses");
            if (key === "2-2") router.push("/instructor/courses/drafts");
            if (key === "3") router.push("/instructor/settings");
          }}
          collapsed={false}
          setCollapsed={() => {}}
        />
      }
    >
      <div style={{ padding: "1rem" }}>
        <Title level={3}>Pending Approval</Title>

        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Spin size="large" />
          </div>
        ) : courses.length === 0 ? (
          <Empty description="No pending courses" />
        ) : (
          <Row gutter={[16, 16]}>
            {courses.map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={course.title}
                      src={course.thumbnail}
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />
                  }
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push({
                          pathname: "/instructor/courses/createCourses",
                          query: { id: course._id },
                        });
                      }}
                      style={{ color: "blue", fontSize: "18px" }}
                    />,
                    <Popconfirm
                      title="Delete this draft?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDelete(course._id);
                      }}
                      onCancel={(e) => e?.stopPropagation()}
                    >
                      <DeleteOutlined
                        key="delete"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: "red", fontSize: "18px" }}
                      />
                    </Popconfirm>,
                  ]}
                >
                  <Card.Meta
                    title={course.title}
                    description={
                      <>
                        <p>{course.category}</p>
                        <p style={{ fontSize: "12px", color: "#888" }}>
                          {course.description?.slice(0, 60)}...
                        </p>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </DashboardLayout>
  );
}
