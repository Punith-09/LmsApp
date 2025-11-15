import { Card, Table, Button, Typography, Popconfirm, Space } from "antd";
import { PlusOutlined, EditFilled, DeleteFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useStoreState } from "easy-peasy";

interface UsersTableProps {
  loading: boolean;
  data: any[];
  onDelete: (id: string) => void;
}

export default function UsersTable({ loading, data, onDelete }: UsersTableProps) {
  const user = useStoreState((state: any) => state.auth.user);
  const { Title } = Typography;
  const router = useRouter();

  const baseColumns =
    user?.role === "instructor"
      ? [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Role", dataIndex: "role", key: "role" },
      ]
      : [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Role", dataIndex: "role", key: "role" },
        {
          title: "Registered On",
          dataIndex: "createdAt",
          key: "createdAt",
          render: (date: string) =>
            date ? new Date(date).toLocaleDateString() : "-",
        },
      ];

  const instructorColumns = [
    ...baseColumns,
    {
      title: "Courses Enrolled",
      dataIndex: "courses",
      key: "courses",
      render: (courses: { title: string; enrolledAt: Date }[]) =>
        courses && courses.length > 0 ? (
          <div>
            {courses.map((c, idx) => (
              <div key={idx}>
                <strong>{c.title}</strong>
                <div style={{ fontSize: 12, color: "#555" }}>
                  Enrolled On: {new Date(c.enrolledAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          "—"
        ),
    },
  ];

  const adminColumns = [
    ...baseColumns,
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditFilled />}
            onClick={() => router.push(`/admin/createUser?id=${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteFilled />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns = user?.role === "instructor" ? instructorColumns : adminColumns;

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title level={4}>Registered Users</Title>
        {user?.role !== "instructor" && (
          <Button
            type="primary"
            style={{ padding: "15px" }}
            onClick={() => router.push("/admin/createUser")}
          >
            <PlusOutlined />
            Create User
          </Button>
        )}
      </div>

      <Table loading={loading} rowKey="_id" dataSource={data} columns={columns} />
    </Card>
  );
}
