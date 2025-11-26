// "use client";

// import React, { useState, useEffect } from "react";
// import { Form, Input, Button, Upload, Select, Card, message, Typography, Switch, InputNumber, Space, } from "antd";
// import { UploadOutlined, LeftOutlined, MinusCircleOutlined, PlusCircleOutlined, } from "@ant-design/icons";
// import DashboardLayout from "@/components/Dashboard/DashboardLayout";
// import SidebarMenu from "@/components/Dashboard/SidebarMenu";
// import { useRouter } from "next/router";
// import { useStoreState, useStoreActions } from "easy-peasy";
// import { toast } from "react-toastify";

// const { Title } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;

// export default function CreateCourse() {
//   const [form] = Form.useForm();
//   const router = useRouter();
//   const { id } = router.query;
//   const [isEdit, setIsEdit] = useState(false);
//   const user = useStoreState((state: any) => state.auth.user);
//   const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
//   const isLoading = useStoreState((state: any) => state.loading.isLoading);

//   const [thumbnail, setThumbnail] = useState<string>("");
//   const [introVideo, setIntroVideo] = useState<string>("");
//   const [isPaid, setIsPaid] = useState(false);

//   useEffect(() => {
//     if (id) {
//       setIsEdit(true);
//       fetchCourseData(id as string);
//     }
//   }, [id]);

//   const fetchCourseData = async (courseId: string) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/admin/courses/${courseId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         form.setFieldsValue({
//           title: data.course.title,
//           description: data.course.description,
//           category: data.course.category,
//           isPaid: data.course.isPaid,
//           price: data.course.price,
//           sections: data.course.sections || [],
//         });
//         setThumbnail(data.course.thumbnail);
//         setIntroVideo(data.course.introVideo);
//         setIsPaid(data.course.isPaid);
//       } else {
//         toast.error(data.message || "Failed to load course");
//       }
//     } catch (err) {
//       toast.error("Error fetching course");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async (file: File, type: "thumbnail" | "introVideo" | "lessonVideo") => {
//     const formData = new FormData();
//     formData.append(type, file);

//     try {
//       setLoading(true);
//       const res = await fetch("/api/admin/courses/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         return data.files[0].path;
//       } else {
//         toast.error(data.message || "Upload failed");
//         return null;
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Error uploading file");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onFinish = async (values: any) => {
//     if (!thumbnail || !introVideo) {
//       message.warning("Please upload thumbnail and intro video");
//       return;
//     }

//     const payload = {
//       title: values.title,
//       description: values.description,
//       category: values.category,
//       thumbnail,
//       introVideo,
//       isPaid,
//       price: isPaid ? values.price : 0,
//       sections: values.sections || [],
//     };

//     const method = isEdit ? "PUT" : "POST";
//     const endpoint = isEdit? `/api/admin/courses/${id}`: `/api/admin/courses/create`;

//     try {
//       setLoading(true);
//       const res = await fetch(endpoint, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(isEdit ? "Course updated" : "Course created");
//         router.push("/admin/courses/courses");
//       } else {
//         toast.error(data.message || "Failed to save course");
//       }
//     } catch (err) {
//       toast.error("Error saving course");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <DashboardLayout
//       sider={
//         <SidebarMenu
//           selectedKey="2"
//           onSelect={(key) => {
//             if (key === "1") router.push("/admin/dashboard");
//             if (key === "2-1") router.push("/admin/courses");
//             if (key === "3") router.push("/admin/users");
//             if (key === "4") router.push("/admin/settings");
//           }}
//           collapsed={false}
//           setCollapsed={() => { }}
//         />
//       }
//     >
//       <Card style={{ margin: "1rem" }}>
//         <Title level={3}>
//           <LeftOutlined
//             style={{ paddingRight: "15px" }}
//             onClick={() => router.push("/admin/courses/courses")}
//           />
//           {isEdit ? "Edit Course" : "Create New Course"}
//         </Title>

//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           <Form.Item name="title" label="Title" rules={[{ required: true, message: "Enter title" }]}>
//             <Input placeholder="Course title" />
//           </Form.Item>

//           <Form.Item name="description" label="Description" rules={[{ required: true }]}>
//             <TextArea rows={4} placeholder="Description" />
//           </Form.Item>

//           <Form.Item name="category" label="Category" rules={[{ required: true }]}>
//             <Select placeholder="Select category">
//               <Option value="Web Development">Development</Option>

//               <Option value="Data Science">Data Science</Option>
//               <Option value="AI/ML">AI/ML</Option>
//               <Option value="Design">Designing</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Thumbnail" required>
//             <Upload
//               beforeUpload={(file) => {
//                 handleFileUpload(file, "thumbnail").then((path) => path && setThumbnail(path));
//                 return false;
//               }}
//               showUploadList={false}
//             >
//               <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
//             </Upload>
//             {thumbnail && <img src={thumbnail} alt="thumb" style={{ width: 200, marginTop: 10 }} />}
//           </Form.Item>

//           <Form.Item label="Intro Video" required>
//             <Upload
//               beforeUpload={(file) => {
//                 handleFileUpload(file, "introVideo").then((path) => path && setIntroVideo(path));
//                 return false;
//               }}
//               showUploadList={false}
//             >
//               <Button icon={<UploadOutlined />}>Upload Intro Video</Button>
//             </Upload>
//             {introVideo && (
//               <video width="300" controls style={{ marginTop: 10 }}>
//                 <source src={introVideo} />
//               </video>
//             )}
//           </Form.Item>

//           <Form.Item name="isPaid" label="Paid Course?" valuePropName="checked">
//             <Switch checked={isPaid} onChange={setIsPaid} />
//           </Form.Item>

//           {isPaid && (
//             <Form.Item
//               name="price"
//               label="Price"
//               rules={[{ required: true, message: "Enter price" }]}
//             >
//               <InputNumber min={0} style={{ width: "100%" }} placeholder="Price in INR" />
//             </Form.Item>
//           )}


//           <Form.List name="sections">
//             {(secFields, { add: addSec, remove: remSec }) => (
//               <>
//                 {secFields.map((secField) => (
//                   <Card
//                     key={secField.key}
//                     type="inner"
//                     title={`Section ${secField.name + 1}`}
//                     extra={
//                       <Button danger type="link" icon={<MinusCircleOutlined />} onClick={() => remSec(secField.name)}>
//                         Remove Section
//                       </Button>
//                     }
//                     style={{ marginBottom: 20 }}
//                   >
//                     <Form.Item
//                       name={[secField.name, "title"]}
//                       label="Section Title"
//                       rules={[{ required: true, message: "Section title required" }]}
//                     >
//                       <Input placeholder="Section title" />
//                     </Form.Item>

//                     <Form.List name={[secField.name, "lessons"]}>
//                       {(lessonFields, { add: addLesson, remove: remLesson }) => (
//                         <>
//                           {lessonFields.map((lessonField) => (
//                             <Card
//                               key={lessonField.key}
//                               size="small"
//                               style={{ marginBottom: 12 }}
//                               title={`Lesson ${lessonField.name + 1}`}
//                               extra={
//                                 <Button danger type="link" icon={<MinusCircleOutlined />} onClick={() => remLesson(lessonField.name)}>
//                                   Remove Lesson
//                                 </Button>
//                               }
//                             >
//                               <Form.Item
//                                 name={[lessonField.name, "title"]}
//                                 label="Lesson Title"
//                                 rules={[{ required: true }]}
//                               >
//                                 <Input placeholder="Lesson title" />
//                               </Form.Item>

//                               <Form.Item
//                                 label="Lesson Video"
//                                 required
//                               >
//                                 <Upload
//                                   beforeUpload={(file) => {
//                                     handleFileUpload(file, "lessonVideo").then((path) => {
//                                       if (path) {
//                                         const currentSections = form.getFieldValue("sections");
//                                         currentSections[secField.name].lessons[lessonField.name].videoUrl = path;
//                                         form.setFieldsValue({ sections: currentSections });
//                                       }
//                                     });
//                                     return false;
//                                   }}
//                                   showUploadList={false}
//                                 >
//                                   <Button icon={<UploadOutlined />}>Upload Video</Button>
//                                 </Upload>
//                               </Form.Item>

//                               <Form.Item
//                                 name={[lessonField.name, "videoUrl"]}
//                                 hidden
//                                 rules={[{ required: true, message: "Lesson video is required" }]}
//                               >
//                                 <Input type="hidden" />
//                               </Form.Item>
//                             </Card>
//                           ))}
//                           <Button type="dashed" onClick={() => addLesson()} block icon={<PlusCircleOutlined />}>
//                             Add Lesson
//                           </Button>
//                         </>
//                       )}
//                     </Form.List>
//                   </Card>
//                 ))}
//                 <Button type="dashed" onClick={() => addSec()} block icon={<PlusCircleOutlined />}>
//                   Add Section
//                 </Button>
//               </>
//             )}
//           </Form.List>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={isLoading}
//               style={{ width: "20%", marginTop:"15px" }}
//             >
//               {isEdit ? "Update Course" : "Create Course"}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </DashboardLayout>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  Card,
  message,
  Typography,
  Switch,
  InputNumber,
} from "antd";
import {
  UploadOutlined,
  LeftOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "easy-peasy";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function CreateCourse() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const [isEdit, setIsEdit] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [introVideo, setIntroVideo] = useState<string>("");
  const [isPaid, setIsPaid] = useState(false);

  const user = useStoreState((state: any) => state.auth.user);
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
  const isLoading = useStoreState((state: any) => state.loading.isLoading);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") ?? "";
  };

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchCourseData(id as string);
    }
  }, [id]);

  const fetchCourseData = async (courseId: string) => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        form.setFieldsValue({
          title: data.course.title,
          description: data.course.description,
          category: data.course.category,
          isPaid: data.course.isPaid,
          price: data.course.price,
          sections: data.course.sections || [],
        });
        setThumbnail(data.course.thumbnail);
        setIntroVideo(data.course.introVideo);
        setIsPaid(data.course.isPaid);
      } else {
        toast.error(data.message || "Failed to load course");
      }
    } catch (err) {
      toast.error("Error fetching course");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: "thumbnail" | "introVideo" | "lessonVideo") => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      setLoading(true);
      const res = await fetch("/api/admin/courses/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) return data.files[0].path;
      else {
        toast.error(data.message || "Upload failed");
        return null;
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!thumbnail || !introVideo) {
      message.warning("Please upload thumbnail and intro video");
      return;
    }

    const payload = {
      title: values.title,
      description: values.description,
      category: values.category,
      thumbnail,
      introVideo,
      isPaid,
      price: isPaid ? values.price : 0,
      sections: values.sections || [],
    };

    const method = isEdit ? "PUT" : "POST";
    const endpoint = isEdit
      ? `/api/admin/courses/${id}`
      : `/api/admin/courses/create`;

    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? "Course updated" : "Course created");
        router.push("/admin/courses/courses");
      } else {
        toast.error(data.message || "Failed to save course");
      }
    } catch (err) {
      toast.error("Error saving course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="2"
          onSelect={(key) => {
            if (key === "1") router.push("/admin/dashboard");
            if (key === "2-1") router.push("/admin/courses");
            if (key === "3") router.push("/admin/users");
            if (key === "4") router.push("/admin/settings");
          }}
          collapsed={false}
          setCollapsed={() => {}}
        />
      }
    >
      <Card style={{ margin: "1rem" }}>
        <Title level={3}>
          <LeftOutlined
            style={{ paddingRight: "15px" }}
            onClick={() => router.push("/admin/courses/courses")}
          />
          {isEdit ? "Edit Course" : "Create New Course"}
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Enter title" }]}
          >
            <Input placeholder="Course title" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Description" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Option value="Web Development">Development</Option>
              <Option value="Data Science">Data Science</Option>
              <Option value="AI/ML">AI/ML</Option>
              <Option value="Design">Designing</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Thumbnail" required>
            <Upload
              beforeUpload={(file) => {
                handleFileUpload(file, "thumbnail").then((path) => path && setThumbnail(path));
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
            </Upload>
            {thumbnail && <img src={thumbnail} alt="thumb" style={{ width: 200, marginTop: 10 }} />}
          </Form.Item>

          <Form.Item label="Intro Video" required>
            <Upload
              beforeUpload={(file) => {
                handleFileUpload(file, "introVideo").then((path) => path && setIntroVideo(path));
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Intro Video</Button>
            </Upload>
            {introVideo && (
              <video width="300" controls style={{ marginTop: 10 }}>
                <source src={introVideo} />
              </video>
            )}
          </Form.Item>

          <Form.Item name="isPaid" label="Paid Course?" valuePropName="checked">
            <Switch checked={isPaid} onChange={setIsPaid} />
          </Form.Item>

          {isPaid && (
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Enter price" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="Price in INR" />
            </Form.Item>
          )}

          {/* Section and Lesson management stays unchanged */}
          <Form.List name="sections">
            {(secFields, { add: addSec, remove: remSec }) => (
              <>
                {secFields.map((secField) => (
                  <Card
                    key={secField.key}
                    type="inner"
                    title={`Section ${secField.name + 1}`}
                    extra={
                      <Button
                        danger
                        type="link"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remSec(secField.name)}
                      >
                        Remove Section
                      </Button>
                    }
                    style={{ marginBottom: 20 }}
                  >
                    <Form.Item
                      name={[secField.name, "title"]}
                      label="Section Title"
                      rules={[{ required: true, message: "Section title required" }]}
                    >
                      <Input placeholder="Section title" />
                    </Form.Item>

                    <Form.List name={[secField.name, "lessons"]}>
                      {(lessonFields, { add: addLesson, remove: remLesson }) => (
                        <>
                          {lessonFields.map((lessonField) => (
                            <Card
                              key={lessonField.key}
                              size="small"
                              style={{ marginBottom: 12 }}
                              title={`Lesson ${lessonField.name + 1}`}
                              extra={
                                <Button
                                  danger
                                  type="link"
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => remLesson(lessonField.name)}
                                >
                                  Remove Lesson
                                </Button>
                              }
                            >
                              <Form.Item
                                name={[lessonField.name, "title"]}
                                label="Lesson Title"
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Lesson title" />
                              </Form.Item>

                              <Form.Item label="Lesson Video" required>
                                <Upload
                                  beforeUpload={(file) => {
                                    handleFileUpload(file, "lessonVideo").then((path) => {
                                      if (path) {
                                        const currentSections = form.getFieldValue("sections");
                                        currentSections[secField.name].lessons[lessonField.name].videoUrl = path;
                                        form.setFieldsValue({ sections: currentSections });
                                      }
                                    });
                                    return false;
                                  }}
                                  showUploadList={false}
                                >
                                  <Button icon={<UploadOutlined />}>Upload Video</Button>
                                </Upload>
                              </Form.Item>

                              <Form.Item
                                name={[lessonField.name, "videoUrl"]}
                                hidden
                                rules={[{ required: true, message: "Lesson video is required" }]}
                              >
                                <Input type="hidden" />
                              </Form.Item>
                            </Card>
                          ))}
                          <Button
                            type="dashed"
                            icon={<PlusCircleOutlined />}
                            onClick={() => addLesson()}
                            style={{ width: "100%" }}
                          >
                            Add Lesson
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusCircleOutlined />}
                  onClick={() => addSec()}
                  style={{ width: "100%" }}
                >
                  Add Section
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isEdit ? "Update Course" : "Create Course"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </DashboardLayout>
  );
}
