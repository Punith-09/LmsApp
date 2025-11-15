"use client";

import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Spin } from "antd";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/course.module.scss"
import { useStoreActions, useStoreState } from "easy-peasy";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  introVideo: string;
  isPaid: boolean;
  price: number;
  createdBy: {
    name: string;
  };
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);

  const loading = useStoreState((state: any) => state.loading.isLoading);
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (id: string) => {

    router.push(`/user/courses/${id}`);
  };

  return (
    <Layout className={styles.containerr}>
      <Navbar />
      <Content style={{ padding: "2rem 4rem", marginTop: '80px' }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "2rem" }}>
          All Courses
        </Title>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: 100 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "40px",
            }}
          >
            {courses.map((course) => (
              <Card
                key={course._id}
                hoverable
                onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(course._id);
                    }}
                cover={
                  <img
                    alt={course.title}
                    src={course.thumbnail}
                    style={{ height: 200, objectFit: "fill" }}
                  />
                }
                style={{
                  cursor: "pointer",
                  width: "300px",
                  minHeight: "360px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                
                <div className={styles.cardBody}>
                  <div>
                    <Title level={4} style={{ minHeight: "48px" }}>
                      {course.title}
                    </Title>
                    <Title level={4}>{course.createdBy?.name}</Title>
                    <Paragraph style={{ fontWeight: 500, color: "#333" }}>
                      {course.isPaid ? `₹${course.price}` : "Free"}
                    </Paragraph>
                  </div>

                  
                  <button
                    className={styles.enrollButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(course._id);
                    }}
                  >
                    Details
                  </button>
                </div>
              </Card>
            ))}

          </div>
        )}
      </Content>
      <Footer />
    </Layout>
  );
}
