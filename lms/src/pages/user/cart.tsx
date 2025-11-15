import React, { useEffect, useState } from "react";
import { Layout, Typography, Button, Spin, message, Card } from "antd";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/cart.module.scss";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  price: number;
  description: string;
  createdBy: {
    name: string;
  };
}

export default function CartPage() {
  const cartItems = useStoreState((state: any) => state.cart.items);
  const removeFromCart = useStoreActions((actions: any) => actions.cart.removeFromCart);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0) {
      setCourses([]);
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseIds: cartItems }),
        });

        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
        message.error("Failed to load cart courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [cartItems]);

  const handleRemove = (courseId: string) => {
    removeFromCart(courseId);
  };

  const handleCheckout = (courseId: string) => {
    router.push(`/purchase/${courseId}`);
  };

  return (
    <Layout className={styles.layout}>
      <Navbar />
      <Content className={styles.content}>
        <Title className={styles.title} level={2}>Your Cart</Title>

        {loading ? (
          <Spin size="large" />
        ) : cartItems.length === 0 ? (
          <Paragraph>Your cart is empty.</Paragraph>
        ) : (
          <div className={styles.itemsContainer}>
            {courses.map((course) => (
              <Card
                key={course._id}
                className={styles.cartItem}
                // bordered={true}
                // bodyStyle={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className={styles.itemInfo}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className={styles.thumbnail}
                  />
                  <div>
                    <Title level={4} style={{ marginBottom: 8 }}>{course.title}</Title>
                    <Paragraph>{course.description}</Paragraph>
                    <Paragraph>
                      <strong>Instructor:</strong> {course.createdBy?.name}
                    </Paragraph>
                    <Paragraph>
                      <strong>Price:</strong> ₹{course.price}
                    </Paragraph>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <button className={styles.removeButton} onClick={() => handleRemove(course._id)}>
                    Remove
                  </button>
                  <button className={styles.checkoutButton} onClick={() => handleCheckout(course._id)}>
                    Checkout
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
