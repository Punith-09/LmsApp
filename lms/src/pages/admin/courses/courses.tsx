// "use client";

// import React, { useEffect, useState } from "react";
// import {Button,Card,Row,Col,Spin,Empty,Typography,Popconfirm,Tabs,Space,} from "antd";
// import {EditOutlined,DeleteOutlined,CheckOutlined,CloseOutlined,PlusOutlined,} from "@ant-design/icons";
// import DashboardLayout from "@/components/Dashboard/DashboardLayout";
// import SidebarMenu from "@/components/Dashboard/SidebarMenu";
// import { useRouter } from "next/router";
// import { useStoreActions, useStoreState } from "easy-peasy";
// import { toast } from "react-toastify";

// const { Title } = Typography;
// // const { TabPane } = Tabs;

// export default function AdminCoursesPage() {
//   const router = useRouter();
//   const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
//   const isLoading = useStoreState((state: any) => state.loading.isLoading);

//   const [courses, setCourses] = useState<any[]>([]);
//   const [activeTab, setActiveTab] = useState("all");

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/admin/courses", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setCourses(data.courses);
//       } else {
//         toast.error(data.message || "Failed to fetch courses");
//       }
//     } catch (err) {
//       console.error(err);
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

//   const handleApproval = async (id: string, status: "approved" | "rejected") => {
//     try {
//       const res = await fetch(`/api/admin/courses/approve/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ status }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(`Course ${status}`);
//         fetchCourses();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Error updating course status");
//     }
//   };

//   const filteredCourses =
//     activeTab === "all"
//       ? courses
//       : courses.filter((c) => c.status === "pending");
     
//   const handleCardClick = (id: string) => {
//     router.push(`/admin/courses/${id}`);
//   };   

//   return (
//     <DashboardLayout
//       sider={
//         <SidebarMenu
//           selectedKey="2-1"
//           onSelect={(key) => {
//             if (key === "1") router.push("/admin/dashboard");
//             if (key === "2-1") router.push("/admin/courses/courses");
//             if (key === "3") router.push("/admin/settings");
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
//           <Title level={3}>Manage Courses</Title>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => router.push("/admin/courses/createCourses")}
//           >
//             Create Course
//           </Button>
//         </div>

//         <Tabs
//           activeKey={activeTab}
//           onChange={(key) => setActiveTab(key)}
//           items={[
//             { key: "all", label: "All Courses" },
//             { key: "pending", label: "Pending Approval" },
//           ]}
//         />

//         {isLoading ? (
//           <div style={{ textAlign: "center", marginTop: "3rem" }}>
//             <Spin size="large" />
//           </div>
//         ) : filteredCourses.length === 0 ? (
//           <Empty
//             description={
//               activeTab === "pending"
//                 ? "No pending courses for approval"
//                 : "No courses found"
//             }
//           />
//         ) : (
//           <Row gutter={[16, 16]}>
//             {filteredCourses.map((course) => (
//               <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
//                 <Card
//                   hoverable
//                   onClick={(e) => {
//                       e.stopPropagation();
//                       handleCardClick(course._id);
//                     }}
//                   cover={
//                     <img
//                       alt={course.title}
//                       src={course.thumbnail}
//                       style={{
//                         height: "180px",
//                         objectFit: "fill",
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
//                           pathname: "/admin/courses/createCourses",
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
//                 >
//                   <Card.Meta
//                     title={course.title}
//                     description={
//                       <>
//                         <p>{course.category}</p>
//                         <p style={{ fontSize: "12px", color: "#888" }}>
//                           {course.description?.slice(0, 60)}...
//                         </p>
//                         <p>
//                           <b>Status:</b>{" "}
//                           <span
//                             style={{
//                               color:
//                                 course.status === "approved"
//                                   ? "green"
//                                   : course.status === "pending"
//                                   ? "orange"
//                                   : "red",
//                             }}
//                           >
//                             {course.status}
//                           </span>
//                         </p>
//                       </>
//                     }
//                   />
//                   {course.status === "pending" && (
//                     <Space style={{ marginTop: "10px" }}>
//                       <Button
//                         size="small"
//                         icon={<CheckOutlined />}
//                         type="primary"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleApproval(course._id, "approved");
//                         }}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         size="small"
//                         danger
//                         icon={<CloseOutlined />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleApproval(course._id, "rejected");
//                         }}
//                       >
//                         Reject
//                       </Button>
//                     </Space>
//                   )}
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
import {
  Button,
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Typography,
  Popconfirm,
  Tabs,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useRouter } from "next/router";
import { useStoreActions, useStoreState } from "easy-peasy";
import { toast } from "react-toastify";

const { Title } = Typography;

export default function AdminCoursesPage() {
  const router = useRouter();
  const setLoading = useStoreActions(
    (actions: any) => actions.loading.setLoading
  );
  const isLoading = useStoreState((state: any) => state.loading.isLoading);

  const [courses, setCourses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") ?? "";
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch("/api/admin/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (err) {
      console.error(err);
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
      const token = getToken();
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

  const handleApproval = async (id: string, status: "approved" | "rejected") => {
    try {
      const token = getToken();
      const res = await fetch(`/api/admin/courses/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Course ${status}`);
        fetchCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating course status");
    }
  };

  const filteredCourses =
    activeTab === "all"
      ? courses
      : courses.filter((c) => c.status === "pending");

  const handleCardClick = (id: string) => {
    router.push(`/admin/courses/${id}`);
  };

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="2-1"
          onSelect={(key) => {
            if (key === "1") router.push("/admin/dashboard");
            if (key === "2-1") router.push("/admin/courses/courses");
            if (key === "3") router.push("/admin/settings");
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
          <Title level={3}>Manage Courses</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/admin/courses/createCourses")}
          >
            Create Course
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={[
            { key: "all", label: "All Courses" },
            { key: "pending", label: "Pending Approval" },
          ]}
        />

        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Spin size="large" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <Empty
            description={
              activeTab === "pending"
                ? "No pending courses for approval"
                : "No courses found"
            }
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredCourses.map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
                <Card
                  hoverable
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(course._id);
                  }}
                  cover={
                    <img
                      alt={course.title}
                      src={course.thumbnail}
                      style={{
                        height: "180px",
                        objectFit: "fill",
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
                          pathname: "/admin/courses/createCourses",
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
                >
                  <Card.Meta
                    title={course.title}
                    description={
                      <>
                        <p>{course.category}</p>
                        <p style={{ fontSize: "12px", color: "#888" }}>
                          {course.description?.slice(0, 60)}...
                        </p>
                        <p>
                          <b>Status:</b>{" "}
                          <span
                            style={{
                              color:
                                course.status === "approved"
                                  ? "green"
                                  : course.status === "pending"
                                  ? "orange"
                                  : "red",
                            }}
                          >
                            {course.status}
                          </span>
                        </p>
                      </>
                    }
                  />
                  {course.status === "pending" && (
                    <Space style={{ marginTop: "10px" }}>
                      <Button
                        size="small"
                        icon={<CheckOutlined />}
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproval(course._id, "approved");
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproval(course._id, "rejected");
                        }}
                      >
                        Reject
                      </Button>
                    </Space>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </DashboardLayout>
  );
}
