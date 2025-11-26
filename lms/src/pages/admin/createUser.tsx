// "use client";

// import React, { useEffect, useState } from "react";
// import { Form, Input, Select, Button, Typography, message, Card } from "antd";
// import { LeftOutlined } from "@ant-design/icons";
// import { useRouter } from "next/router";
// import { Controller, useForm } from "react-hook-form";
// import SidebarMenu from "@/components/Dashboard/SidebarMenu";
// import DashboardLayout from "@/components/Dashboard/DashboardLayout";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { RegisterInput, registerSchema } from "@/forms/resolvers/userSchema";
// import { toast } from "react-toastify";

// const { Title } = Typography;
// const { Option } = Select;

// const CreateUser = () => {
//   const router = useRouter();
//   const { id } = router.query; 

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<RegisterInput>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: { role: "user" },
//   });

//   const [loading, setLoading] = useState(false);
//   const isEditing = Boolean(id);

 
//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!id) return;
//       try {
//         setLoading(true);
        
//         const token = localStorage.getItem("token");
//         const res = await fetch(`/api/admin/users/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json();
//         if (res.ok) {
//           reset({
//             name: json.name,
//             email: json.email,
//             role: json.role,
//             password: "",
//             confirmPassword: "",
//           });
//         } else {
//           toast.error(json.error || "Failed to load user details");
//         }
//       } catch (err) {
//         toast.error("Error fetching user details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id, reset]);

  
//   const onSubmit = async (data: any) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       const endpoint = isEditing ? `/api/admin/users/${id}` : "/api/register";
//       const method = isEditing ? "PUT" : "POST";

//       const res = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       const json = await res.json();

//       if (res.ok) {
//         toast.success(isEditing ? "User updated successfully!" : "User created successfully!");
//         router.push("/admin/users");
//       } else {
//         toast.error(json.error || "Something went wrong");
//       }
//     } catch (err) {
//       message.error(isEditing ? "Error updating user" : "Error creating user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout
//       sider={
//         <SidebarMenu
//           selectedKey="3"
//           onSelect={(key) => {
//             if (key === "1") router.push("/admin/dashboard");
//             if (key === "2-1") router.push("/admin/courses/courses");
//             if (key === "2-2") router.push("/admin/courses/drafts");
//             if (key === "3") router.push("/admin/users");
//             if (key === "4") router.push("/admin/settings");
//           }}
//           collapsed={false}
//           setCollapsed={() => {}}
//         />
//       }
//     >
//       <Card>
//         <Title level={3}>
//           <LeftOutlined
//             style={{ paddingRight: "15px" }}
//             onClick={() => router.push("/admin/users")}
//           />
//           {isEditing ? "Edit User" : "Create User"}
//         </Title>

//         <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
//           <Form.Item label="Role">
//             <Controller
//               name="role"
//               control={control}
//               render={({ field }) => (
//                 <Select {...field} onChange={(val) => field.onChange(val)}>
//                   <Option value="user">User</Option>
//                   <Option value="instructor">Instructor</Option>
//                   <Option value="subadmin">Sub Admin</Option>
//                   <Option value="admin">Admin</Option>
//                 </Select>
//               )}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Full name"
//             validateStatus={errors.name ? "error" : ""}
//             help={errors.name?.message}
//           >
//             <Controller
//               name="name"
//               control={control}
//               render={({ field }) => <Input {...field} placeholder="Your full name" />}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             validateStatus={errors.email ? "error" : ""}
//             help={errors.email?.message}
//           >
//             <Controller
//               name="email"
//               control={control}
//               render={({ field }) => (
//                 <Input {...field} placeholder="Your email" disabled={isEditing} />
//               )}
//             />
//           </Form.Item>

//           {!isEditing && (
//             <>
//               <Form.Item
//                 label="Password"
//                 validateStatus={errors.password ? "error" : ""}
//                 help={errors.password?.message}
//               >
//                 <Controller
//                   name="password"
//                   control={control}
//                   render={({ field }) => (
//                     <Input.Password {...field} placeholder="Password" />
//                   )}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Confirm Password"
//                 validateStatus={errors.confirmPassword ? "error" : ""}
//                 help={errors.confirmPassword?.message}
//               >
//                 <Controller
//                   name="confirmPassword"
//                   control={control}
//                   render={({ field }) => (
//                     <Input.Password {...field} placeholder="Confirm password" />
//                   )}
//                 />
//               </Form.Item>
//             </>
//           )}

//           <Form.Item>
//             <Button
//               style={{ width: "50vh" }}
//               type="primary"
//               htmlType="submit"
//               block
//               loading={loading}
//             >
//               {isEditing ? "Update User" : "Create User"}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default CreateUser; 

"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Typography, message, Card } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput, registerSchema } from "@/forms/resolvers/userSchema";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;

const CreateUser = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "user" },
  });

  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);

        // FIX: Only use localStorage in the browser
        let token = null;
        if (typeof window !== "undefined") {
          token = localStorage.getItem("token");
        }

        const res = await fetch(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (res.ok) {
          reset({
            name: json.name,
            email: json.email,
            role: json.role,
            password: "",
            confirmPassword: "",
          });
        } else {
          toast.error(json.error || "Failed to load user details");
        }
      } catch {
        toast.error("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      // FIX: browser-only localStorage
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      const endpoint = isEditing ? `/api/admin/users/${id}` : "/api/register";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success(isEditing ? "User updated successfully!" : "User created successfully!");
        router.push("/admin/users");
      } else {
        toast.error(json.error || "Something went wrong");
      }
    } catch (err) {
      message.error(isEditing ? "Error updating user" : "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="3"
          onSelect={(key) => {
            if (key === "1") router.push("/admin/dashboard");
            if (key === "2-1") router.push("/admin/courses/courses");
            if (key === "2-2") router.push("/admin/courses/drafts");
            if (key === "3") router.push("/admin/users");
            if (key === "4") router.push("/admin/settings");
          }}
          collapsed={false}
          setCollapsed={() => {}}
        />
      }
    >
      <Card>
        <Title level={3}>
          <LeftOutlined style={{ paddingRight: "15px" }} onClick={() => router.push("/admin/users")} />
          {isEditing ? "Edit User" : "Create User"}
        </Title>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* ...rest unchanged... */}
        </Form>
      </Card>
    </DashboardLayout>
  );
};

export default CreateUser;
