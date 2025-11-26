// "use client";

// import React, { useEffect, useState } from "react";
// import { Button, Card, Row, Col, Spin, Empty, Typography, Popconfirm } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import DashboardLayout from "@/components/Dashboard/DashboardLayout";
// import SidebarMenu from "@/components/Dashboard/SidebarMenu";
// import { useRouter } from "next/router";
// import { useStoreActions, useStoreState } from "easy-peasy";
// import { toast } from "react-toastify";

// const { Title } = Typography;

// export default function InstructorCoursesPage() {
//   const router = useRouter();
//   const user = useStoreState((state: any) => state.auth.user);
//   const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
//   const isLoading = useStoreState((state: any) => state.loading.isLoading);

//   const [courses, setCourses] = useState<any[]>([]);

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/admin/courses", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await res.json();
//       const approvedCourses = data.courses.filter((c: any) => c.status === "approved");
//       if (res.ok) {
//         setCourses(approvedCourses);
//       } else {
//         toast.error(data.message || "Failed to fetch courses");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error fetching courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const handleDelete = async (id: string) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/admin/courses/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success("Course deleted");
//         fetchCourses();
//       } else {
//         toast.error(data.message || "Failed to delete course");
//       }
//     } catch (err) {
//       toast.error("Error deleting course");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout
//       sider={
//         <SidebarMenu
//           selectedKey="2-1"
//           onSelect={(key) => {
//             if (key === "1") router.push("/instructor/dashboard");
//             if (key === "2-1") router.push("/instructor/courses/courses");
//             if (key === "2-2") router.push("/instructor/courses/drafts");
//             if (key === "3") router.push("/instructor/users");
//             if (key === "4") router.push("/instructor/settings");
//           }}
//           collapsed={false}
//           setCollapsed={() => {}}
//         />
//       }
//     >
//       <div style={{ padding: "1rem" }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "1.5rem",
//           }}
//         >
//           <Title level={3}>My Courses</Title>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => router.push("/instructor/courses/createCourse")}
//           >
//             Create New Course
//           </Button>
//         </div>

//         {isLoading ? (
//           <div style={{ textAlign: "center", marginTop: "3rem" }}>
//             <Spin size="large" />
//           </div>
//         ) : courses.length === 0 ? (
//           <Empty description="No courses found" />
//         ) : (
//           <Row gutter={[16, 16]}>
//             {courses.map((course) => (
//               <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
//                 <Card
//                   hoverable
//                   cover={
//                     <img
//                       alt={course.title}
//                       src={course.thumbnail}
//                       style={{
//                         height: "180px",
//                         objectFit: "cover",
//                         borderRadius: "8px 8px 0 0",
//                       }}
//                     />
//                   }
//                   actions={[
//                     <EditOutlined
//                       key="edit"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         router.push({
//                           pathname: "/instructor/courses/createCourses",
//                           query: { id: course._id },
//                         });
//                       }}
//                       style={{ color: "blue", fontSize: "18px" }}
//                     />,
//                     <Popconfirm
//                       title="Are you sure you want to delete this course?"
//                       okText="Yes"
//                       cancelText="No"
//                       onConfirm={(e) => {
//                         e?.stopPropagation();
//                         handleDelete(course._id);
//                       }}
//                       onCancel={(e) => e?.stopPropagation()}
//                     >
//                       <DeleteOutlined
//                         key="delete"
//                         onClick={(e) => e.stopPropagation()}
//                         style={{ color: "red", fontSize: "18px" }}
//                       />
//                     </Popconfirm>,
//                   ]}
//                   onClick={() => router.push(`/instructor/courses/${course._id}`)}
//                 >
//                   <Card.Meta
//                     title={course.title}
//                     description={
//                       <>
//                         <p>{course.category}</p>
//                         <p style={{ fontSize: "12px", color: "#888" }}>
//                           {course.description?.slice(0, 60)}...
//                         </p>
//                       </>
//                     }
//                   />
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Spin, Empty, Typography, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useRouter } from "next/router";
import { useStoreActions, useStoreState } from "easy-peasy";
import { toast } from "react-toastify";

const { Title } = Typography;

export default function InstructorCoursesPage() {
  const router = useRouter();
  const user = useStoreState((state: any) => state.auth.user);
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
  const isLoading = useStoreState((state: any) => state.loading.isLoading);

  const [courses, setCourses] = useState<any[]>([]);

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      const approvedCourses = data.courses.filter((c: any) => c.status === "approved");
      if (res.ok) {
        setCourses(approvedCourses);
      } else {
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Course deleted");
        fetchCourses();
      } else {
        toast.error(data.message || "Failed to delete course");
      }
    } catch (err) {
      toast.error("Error deleting course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="2-1"
          onSelect={(key) => {
            if (key === "1") router.push("/instructor/dashboard");
            if (key === "2-1") router.push("/instructor/courses/courses");
            if (key === "2-2") router.push("/instructor/courses/drafts");
            if (key === "3") router.push("/instructor/users");
            if (key === "4") router.push("/instructor/settings");
          }}
          collapsed={false}
          setCollapsed={() => {}}
        />
      }
    >
      <div style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <Title level={3}>My Courses</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/instructor/courses/createCourse")}
          >
            Create New Course
          </Button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Spin size="large" />
          </div>
        ) : courses.length === 0 ? (
          <Empty description="No courses found" />
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
                          pathname: "/instructor/courses/createCourse",
                          query: { id: course._id },
                        });
                      }}
                      style={{ color: "blue", fontSize: "18px" }}
                    />,
                    <Popconfirm
                      title="Are you sure you want to delete this course?"
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
                  onClick={() => router.push(`/instructor/courses/${course._id}`)}
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


/* =======================================
   FIX FOR VERCEL BUILD
   DISABLE SSG → FORCE SSR
======================================= */
export const getServerSideProps = async () => {
  return { props: {} };
};
