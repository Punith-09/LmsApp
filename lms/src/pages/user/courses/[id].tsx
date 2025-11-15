"use client";

import React, { useEffect, useState, useRef } from "react";
import { Layout, Typography, Menu, Spin, Tabs, Progress, message, } from "antd";
import { LeftOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/styles/course.module.scss";
import { useStoreActions, useStoreState } from "easy-peasy";

const { Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
}

interface Section {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseCreator {
  _id: string;
  name: string;
}

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  introVideo: string;
  isPaid: boolean;
  price: number;
  sections: Section[];
  createdBy?: CourseCreator;
}

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonMenuItems, setLessonMenuItems] = useState<any[]>([]);
  const [startLearning, setStartLearning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const cartItems = useStoreState((state: any) => state.cart.items);
  const addToCart = useStoreActions((actions: any) => actions.cart.addToCart);
  const user = useStoreState((state: any) => state.auth.user);
  const loading = useStoreState((state: any) => state.loading.isLoading);
  const setLoading = useStoreActions(
    (actions: any) => actions.loading.setLoading
  );
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;


  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch course");
        return res.json();
      })
      .then((data) => {
        setCourse(data.course);
        setIsPurchased(data.isPurchased);
        setLoading(false);

        if (data.isPurchased) {
          const firstLesson = data.course?.sections?.[0]?.lessons?.[0];
          if (firstLesson) setSelectedLesson(firstLesson);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);


  useEffect(() => {
    const restoreProgress = async () => {
      if (!user?.id || !id || !course) return;

      try {
        const res = await fetch(`/api/user/progress?userId=${user.id}`);
        const data = await res.json();

        if (!res.ok) return;
        if (!data.progress || !Array.isArray(data.progress)) return;

        const courseProgress = data.progress.find((p: any) => p.course === id);
        if (!courseProgress) return;

        const { lastWatchedLesson, lastTimestamp, completedLessons } =
          courseProgress;

        setCompletedLessons(completedLessons || []);
        if (course.sections) {
          const totalLessons = course.sections.reduce(
            (sum, s) => sum + s.lessons.length,
            0
          );
          const percent = Math.min(
            Math.round(((completedLessons?.length || 0) / totalLessons) * 100),
            100
          );
          setProgressPercent(percent);
        }

        const lesson = course.sections
          .flatMap((section) => section.lessons)
          .find((l) => l._id === lastWatchedLesson);

        if (lesson) {
          setSelectedLesson(lesson);

          const observer = new MutationObserver(() => {
            const video = videoRef.current;
            if (video) {
              observer.disconnect();

              const setTime = () => {
                if (lastTimestamp > 1) {
                  video.currentTime = lastTimestamp;
                  console.log("Restored video time to:", lastTimestamp);
                }
              };

              if (video.readyState >= 1) {
                setTime();
              } else {
                video.addEventListener("loadedmetadata", setTime, { once: true });
              }
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      } catch (err) {
        console.error("Failed to restore progress:", err);
      }
    };

    restoreProgress();
  }, [user, id, course]);


  useEffect(() => {
    if (!course) return;

    const items = course.sections.map((section: Section, sectionIndex: number) => ({
      key: `section-${section._id}`,
      label: `Section ${sectionIndex + 1}: ${section.title}`,
      children: section.lessons.map((lesson: Lesson, lessonIndex: number) => ({
        key: lesson._id,
        label: (
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {completedLessons.includes(lesson._id) && (
              <CheckCircleFilled style={{ color: "green", fontSize: "16px" }} />
            )}
            {`Lesson ${lessonIndex + 1}: ${lesson.title}`}

          </span>
        ),
      })),
    }));

    setLessonMenuItems(items);
  }, [course, completedLessons]);

  const updateProgress = (completedCount: number) => {
    const totalLessons =
      course?.sections?.reduce((sum, s) => sum + s.lessons.length, 0) || 1;
    const percent = Math.min(
      Math.round((completedCount / totalLessons) * 100),
      100
    );
    setProgressPercent(percent);
  };


  const handleLessonCompleted = async () => {
    if (!user?.id || !selectedLesson || !course) return;
    if (completedLessons.includes(selectedLesson._id)) return;

    try {
      const res = await fetch("/api/user/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          courseId: course._id,
          lessonId: selectedLesson._id,
          markComplete: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedCompleted = [...completedLessons, selectedLesson._id];
        setCompletedLessons(updatedCompleted);
        updateProgress(updatedCompleted.length);
        message.success(`Lesson "${selectedLesson.title}" marked as complete!`);
      } else {
        message.error(data.message || "Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      message.error("Error updating progress");
    }
  };


  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !user || !selectedLesson || !course) return;

    const saveProgress = async () => {
      try {
        await fetch("/api/user/update-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            courseId: course._id,
            lessonId: selectedLesson._id,
            lastTimestamp: videoEl.currentTime,
            markComplete: false,
          }),
        });
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    };

    const onTimeUpdate = () => {
      if (Math.floor(videoEl.currentTime) % 10 === 0) saveProgress();
    };
    const onPause = saveProgress;

    videoEl.addEventListener("timeupdate", onTimeUpdate);
    videoEl.addEventListener("pause", onPause);
    videoEl.addEventListener("ended", handleLessonCompleted);

    return () => {
      videoEl.removeEventListener("timeupdate", onTimeUpdate);
      videoEl.removeEventListener("pause", onPause);
      videoEl.removeEventListener("ended", handleLessonCompleted);
    };
  }, [selectedLesson]);


  const handleLessonSelect = (key: string) => {
    const selected = course?.sections
      .flatMap((section) => section.lessons)
      .find((lesson) => lesson._id === key);
    if (selected) setSelectedLesson(selected);
  };

  const handleGenerateCertificate = async () => {
    if (!user || !course) return;

    try {
      const res = await fetch("/api/user/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          courseId: course._id,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate certificate");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${course.title}_Certificate.pdf`;
      link.click();
      message.success("🎉 Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      message.error("Failed to generate certificate");
    }
  };

  if (loading)
    return (
      <Layout>
        <Navbar />
        <Content style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" />
        </Content>
        <Footer />
      </Layout>
    );

  if (!course)
    return (
      <Layout>
        <Navbar />
        <Content style={{ padding: "2rem 4rem", textAlign: "center" }}>
          <Title level={3}>Course not found</Title>
        </Content>
        <Footer />
      </Layout>
    );

  return (
    <Layout className={styles.nav}>
      <Navbar />
      <Layout
        style={{ marginTop: 80, minHeight: "calc(100vh - 80px)" }}
        className={styles.mainContainer}
      >
        {isPurchased && startLearning ? (
          <>
            <Sider width={300} className={styles.sidebar}>
              <Title level={4}>
                <LeftOutlined
                  style={{ paddingRight: "10px" }}
                  onClick={() => router.push("/user/myLearnings")}
                />
                Course Content
              </Title>
              <Menu
                mode="inline"
                onClick={(e) => handleLessonSelect(e.key)}
                selectedKeys={selectedLesson ? [selectedLesson._id] : []}
                items={lessonMenuItems}
              />
              <div style={{ padding: "1rem" }}>
                <Progress
                  percent={progressPercent}
                  size="small"
                  status="active"
                  strokeColor="#722ed1"
                />
                <Typography.Text type="secondary">
                  {progressPercent}% completed
                </Typography.Text>
              </div>
            </Sider>

            <Content className={styles.vidContent}>
              <Title level={2}>{course.title}</Title>

              {selectedLesson && (
                <>
                  <Title level={4}>{selectedLesson.title}</Title>
                  <video
                    ref={videoRef}
                    width="100%"
                    height="400"
                    controls
                    src={selectedLesson.videoUrl}
                    style={{
                      borderRadius: 8,
                      backgroundColor: "#000",
                      marginBottom: "1rem",
                    }}
                  />

                  <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Transcript" key="1">
                      <Paragraph>
                        Transcript for{" "}
                        <strong>{selectedLesson.title}</strong> will appear here.
                      </Paragraph>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Notes" key="2">
                      <Paragraph>You can write your notes here.</Paragraph>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Downloads" key="3">
                      <Paragraph>No downloads available for this lesson.</Paragraph>
                    </Tabs.TabPane>
                  </Tabs>
                </>
              )}
            </Content>
          </>
        ) : (
          <Content style={{ padding: "2rem" }} className={styles.mainContent}>
            <div className={styles.detailsCard}>
              <video
                width="40%"
                height="400"
                controls
                autoPlay
                src={course.introVideo}
                style={{
                  borderRadius: 8,
                  backgroundColor: "#000",
                  marginBottom: "1rem",
                }}
              />
              <div style={{ marginTop: "30px" }}>
                <Title level={1} style={{ fontWeight: "bold" }}>
                  {course.title}
                </Title>
                <Paragraph>{course.description}</Paragraph>
                <Title level={5}>Created By: {course.createdBy?.name}</Title>
                {!isPurchased && (
                  <Title level={4}>
                    <strong>Price:</strong> ₹{course.price}
                  </Title>
                )}

                {!isPurchased ? (
                  <>
                    <button
                      className={styles.enrollButton}
                      onClick={() =>
                        user
                          ? router.push(`/purchase/${course._id}`)
                          : router.push("/login")
                      }
                    >
                      Enroll Now
                    </button>
                    <button
                      className={styles.cartButton}
                      style={{ marginLeft: "10px" }}
                      onClick={() =>
                        user ? addToCart(course._id) : router.push("/login")
                      }
                      disabled={cartItems.includes(course._id)}
                    >
                      {cartItems.includes(course._id)
                        ? "Added to Cart"
                        : "Add to Cart"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.enrollButton}
                      onClick={() =>
                        user ? setStartLearning(true) : router.push("/login")
                      }
                    >
                      {isPurchased ? "Continue Learning" : "Start Learning"}
                    </button>

                    {progressPercent === 100 && (
                      <button
                        className={styles.certificate}
                        onClick={handleGenerateCertificate}
                      >
                        Generate Certificate
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div style={{ marginTop: "7rem" }}>
              <Title
                level={2}
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                Course Content
              </Title>
              <div className={styles.courseContent}>
                {course.sections.map((section, sectionIndex) => (
                  <div key={section._id} style={{ marginBottom: "2rem" }}>
                    <Title level={4}>
                      Session {String(sectionIndex + 1).padStart(2, "0")} :{" "}
                      {section.title}
                    </Title>

                    {section.lessons.length > 0 && (
                      <ul style={{ paddingLeft: "1.5rem" }}>
                        {section.lessons.map((lesson, lessonIndex) => (
                          <li
                            key={lesson._id}
                            style={{
                              fontSize: "16px",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {lesson.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Content>
        )}
      </Layout>
      <Footer />
    </Layout>
  );
}
