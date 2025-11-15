"use client";

import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Spin, Empty, Progress } from "antd";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStoreState } from "easy-peasy";
import styles from "@/styles/course.module.scss";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  isPaid: boolean;
  progress?: number;
}

export default function MyLearnings() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useStoreState((state: any) => state.auth.user);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/purchased?userId=${user.id}`);
        const data = await res.json();

        if (res.ok) {
          setCourses(data.courses || []);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch purchased courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, [user]);

  const handleCardClick = (id: string) => {
    router.push(`/user/courses/${id}`);
  };

  return (
    <Layout className={styles.containerr}>
      <Navbar />
      <Content style={{ padding: "2rem 4rem", marginTop: "80px", minHeight: "80vh" }}>
        <Title
          level={1}
          style={{ textAlign: "center", marginBottom: "2rem", fontWeight: "bold" }}
        >
          My Learnings
        </Title>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 100 }}>
            <Spin size="large" />
          </div>
        ) : courses.length === 0 ? (
          <Empty
            description="No purchased courses yet. Go explore our courses!"
            style={{ marginTop: 100 }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "40px",
              justifyContent: "center",
            }}
          >
            {courses.map((course) => (
              <Card
                key={course._id}
                hoverable
                cover={
                  <img
                    alt={course.title}
                    src={course.thumbnail}
                    style={{
                      height: 200,
                      objectFit: "fill",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                }
                onClick={() => handleCardClick(course._id)}
                style={{
                  cursor: "pointer",
                  width: "300px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <Title level={4} ellipsis>
                  {course.title}
                </Title>
                <Paragraph ellipsis={{ rows: 2 }}>
                  {course.description || "No description available."}
                </Paragraph>
                <Text type="secondary">{course.category}</Text>

              
                <div style={{ marginTop: 10 }}>
                  <Progress
                    percent={course.progress || 0}
                    size="small"
                    strokeColor="#52c41a"
                  />
                  <Text type="secondary">
                    {course.progress ? `${course.progress}% completed` : "Not started yet"}
                  </Text>
                </div>

               ` {/* <Paragraph style={{ marginTop: 10 }}>
                  {course.isPaid ? `Price: ₹${course.price}` : "Free"}
                </Paragraph>` */}
                <button
                  className={styles.enrollButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(course._id);
                  }}
                >
                  Continue Learning
                </button>
              </Card>
            ))}
          </div>
        )}
      </Content>
      <Footer />
    </Layout>
  );
}
