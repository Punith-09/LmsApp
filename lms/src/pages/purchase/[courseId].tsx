"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout, Typography, Card, Button, Divider, message, Spin } from "antd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/cart.module.scss"
import { toast } from "react-toastify";
import { useStoreState, useStoreActions } from "easy-peasy";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  createdBy: {
    name: string;
  };
}

export default function PurchasePage() {
  const router = useRouter();
  const { courseId } = router.query;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);


  const user = useStoreState((state: any) => state.auth.user);
  const clearCart = useStoreActions((actions: any) => actions.cart.clearCart);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        setCourse(data.course);
      } catch (err) {
        message.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);


  console.log(user?.id);
  const handleCheckout = async () => {
    if (!user?.id) {
      toast.warning("Please login to continue.");
      router.push("/login");
      return;
    }

    if (!course) {
      toast.error("Course details not found.");
      return;
    }

    try {
      setProcessing(true);
      console.log("Checkout payload:", {
        userId: user?.id,
        courseIds: [course._id],
      });

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          courseIds: [course._id],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Course purchased successfully!");
        clearCart();
        router.push(`/user/courses`);
      } else {
        toast.error(data.message || "Checkout failed");
      }
    } catch (err) {
      toast.error("Something went wrong during checkout.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Navbar />
        <Content style={{ padding: "3rem", textAlign: "center" }}>
          <Spin size="large" />
        </Content>
        <Footer />
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <Navbar />
        <Content style={{ padding: "3rem", textAlign: "center" }}>
          <Paragraph>Course not found.</Paragraph>
        </Content>
        <Footer />
      </Layout>
    );
  }

  const discountPercent = 84;
  const discountAmount = Math.round((course.price * discountPercent) / 100);
  const finalPrice = course.price - discountAmount;

  return (
    <Layout>
      <Navbar />
      <Content style={{ padding: "2rem", marginTop: 80, minHeight: "80vh" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >

          <Card
            style={{
              flex: "1 1 500px",
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: "1rem",
            }}
            cover={
              <img
                alt={course.title}
                src={course.thumbnail}
                style={{
                  height: 300,
                  objectFit: "fill",
                  borderRadius: "12px 12px 0 0",
                }}
              />
            }
          >
            <Title level={3}>{course.title}</Title>
            <Paragraph>{course.description}</Paragraph>
            <Paragraph>
              <Text strong>Created By:</Text> {course.createdBy?.name}
            </Paragraph>
          </Card>


          <Card
            style={{
              width: 350,
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: "1.5rem",
              position: "sticky",
              top: 120,
            }}
          >
            <Title level={4}>Order Summary</Title>
            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Original Price:</Text>
              <Text>₹{course.price}</Text>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}
            >
              <Text type="danger">Discount ({discountPercent}% Off):</Text>
              <Text type="danger">-₹{discountAmount}</Text>
            </div>

            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Total (1 course):</Text>
              <Title level={4} style={{ margin: 0 }}>
                ₹{finalPrice}
              </Title>
            </div>

            <Paragraph style={{ fontSize: 12, marginTop: 10 }}>
              By completing your purchase, you agree to our{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Use
              </a>.
            </Paragraph>

            <Button

              block
              size="large"
              loading={processing}
              onClick={handleCheckout}
              style={{ marginTop: 20, borderRadius: 0 }}
              className={styles.checkoutButton}
            >
              {processing ? "Processing..." : `Complete Checkout`}
            </Button>
          </Card>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
}
