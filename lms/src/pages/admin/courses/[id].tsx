// "use client";

// import React, { useEffect, useState } from "react";
// import { Button, Spin, Typography, Modal, message } from "antd";
// import DashboardLayout from "@/components/Dashboard/DashboardLayout";
// import SidebarMenu from "@/components/Dashboard/SidebarMenu";
// import { useRouter } from "next/router";
// import { EditOutlined, DeleteOutlined, LeftOutlined } from "@ant-design/icons";
// import { toast } from "react-toastify";

// const { Title, Paragraph } = Typography;

// export default function AdminCourseDetails() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [course, setCourse] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchCourse = async () => {
//     try {
//       const res = await fetch(`/api/courses/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await res.json();
//       if (res.ok) setCourse(data.course);
//       else message.error(data.message || "Failed to fetch course");
//     } catch (error) {
//       console.error(error);
//       message.error("Error loading course details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchCourse();
//   }, [id]);

  
//   const handleDelete = async () => {
//     Modal.confirm({
//       title: "Are you sure you want to delete this course?",
//       okText: "Yes, Delete",
//       okType: "danger",
//       onOk: async () => {
//         try {
//           const res = await fetch(`/api/admin/courses/${id}`, {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           });

//           const data = await res.json();
//           if (res.ok) {
//             toast.success("Course deleted successfully");
//             router.push("/admin/courses");
//           } else {
//             toast.error(data.message || "Failed to delete course");
//           }
//         } catch (error) {
//           console.error(error);
//           toast.error("Error deleting course");
//         }
//       },
//     });
//   };

//   if (loading)
//     return (
//       <div style={{ textAlign: "center", marginTop: "3rem" }}>
//         <Spin size="large" />
//       </div>
//     );

//   if (!course)
//     return (
//       <div style={{ textAlign: "center", marginTop: "3rem" }}>
//         <Title level={4}>Course not found</Title>
//       </div>
//     );

//   return (
//     <DashboardLayout
//       sider={
//         <SidebarMenu
//           selectedKey="2-1"
//          onSelect={(key) => {
//             if (key === "1") router.push("/admin/dashboard");
//             if (key === "2-1") router.push("/admin/courses");
//             if (key === "2-2") router.push("/admin/courses/drafts");
//             if (key === "3") router.push("/admin/users");
//             if (key === "4") router.push("/admin/settings");
//           }}
//           collapsed={false}
//           setCollapsed={() => {}}
//         />
//       }
//     >
//       <div style={{ padding: "1rem 2rem" }}>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
          
//           <Title level={2}>
//             <LeftOutlined 
//           style={{paddingRight:"10px", fontWeight:"bold", fontSize:"25px"}}
//           onClick={() => router.back()}
//           />
//             {course.title}</Title>
          
//         </div>

//         <img
//           src={course.thumbnail}
//           alt={course.title}
//           style={{
//             width: "100%",
//             maxHeight: "350px",
//             objectFit: "fill",
//             borderRadius: "10px",
//             marginBottom: "1rem",
//           }}
//         />

//         <Paragraph><b>Category:</b> {course.category}</Paragraph>
//         <Paragraph><b>Description:</b> {course.description}</Paragraph>
//         <Paragraph><b>Price:</b> {course.isPaid ? `₹${course.price}` : "Free"}</Paragraph>

//         <div style={{ marginTop: "2rem" }}>
//           <Title level={4}>Course Sections</Title>
//           {course.sections?.map((section: any, idx: number) => (
//             <div key={idx} style={{ marginBottom: "1rem" }}>
//               <Title level={5}>{section.title}</Title>
//               <ul>
//                 {section.lessons.map((lesson: any, i: number) => (
//                   <li key={i}>{lesson.title}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { Button, Spin, Typography, Modal, message } from "antd";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useRouter } from "next/router";
import { EditOutlined, DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Paragraph } = Typography;

export default function AdminCourseDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      let token: string | null = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      const res = await fetch(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token ?? ""}` },
      });

      const data = await res.json();
      if (res.ok) setCourse(data.course);
      else message.error(data.message || "Failed to fetch course");
    } catch (error) {
      console.error(error);
      message.error("Error loading course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete this course?",
      okText: "Yes, Delete",
      okType: "danger",
      onOk: async () => {
        try {
          let token: string | null = null;
          if (typeof window !== "undefined") {
            token = localStorage.getItem("token");
          }

          const res = await fetch(`/api/admin/courses/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token ?? ""}` },
          });

          const data = await res.json();
          if (res.ok) {
            toast.success("Course deleted successfully");
            router.push("/admin/courses");
          } else {
            toast.error(data.message || "Failed to delete course");
          }
        } catch (error) {
          console.error(error);
          toast.error("Error deleting course");
        }
      },
    });
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Spin size="large" />
      </div>
    );

  if (!course)
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Title level={4}>Course not found</Title>
      </div>
    );

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="2-1"
          onSelect={(key) => {
            if (key === "1") router.push("/admin/dashboard");
            if (key === "2-1") router.push("/admin/courses");
            if (key === "2-2") router.push("/admin/courses/drafts");
            if (key === "3") router.push("/admin/users");
            if (key === "4") router.push("/admin/settings");
          }}
          collapsed={false}
          setCollapsed={() => {}}
        />
      }
    >
      <div style={{ padding: "1rem 2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>
            <LeftOutlined
              style={{ paddingRight: "10px", fontWeight: "bold", fontSize: "25px" }}
              onClick={() => router.back()}
            />
            {course.title}
          </Title>
        </div>

        <img
          src={course.thumbnail}
          alt={course.title}
          style={{
            width: "100%",
            maxHeight: "350px",
            objectFit: "fill",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        />

        <Paragraph>
          <b>Category:</b> {course.category}
        </Paragraph>
        <Paragraph>
          <b>Description:</b> {course.description}
        </Paragraph>
        <Paragraph>
          <b>Price:</b> {course.isPaid ? `₹${course.price}` : "Free"}
        </Paragraph>

        <div style={{ marginTop: "2rem" }}>
          <Title level={4}>Course Sections</Title>
          {course.sections?.map((section: any, idx: number) => (
            <div key={idx} style={{ marginBottom: "1rem" }}>
              <Title level={5}>{section.title}</Title>
              <ul>
                {section.lessons.map((lesson: any, i: number) => (
                  <li key={i}>{lesson.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
