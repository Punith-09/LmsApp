import { Menu, Button, Tooltip } from "antd";
import {UserOutlined,BookOutlined,TeamOutlined,SettingOutlined,MenuOutlined,} from "@ant-design/icons";
import styles from "@/styles/Navbar.module.scss";

interface SidebarMenuProps {
  selectedKey: string;
  onSelect: (key: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function SidebarMenu({selectedKey,onSelect,collapsed,setCollapsed,}: SidebarMenuProps) {
  const { SubMenu } = Menu;
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "16px 20px",
          height: "64px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {!collapsed && <div className={styles.adminSide}>LMS</div>}

        <Tooltip title={collapsed ? "Expand" : "Collapse"}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Tooltip>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) => onSelect(e.key)}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<UserOutlined />}>
          Dashboard
        </Menu.Item>
      
        <SubMenu key="2" icon={<BookOutlined />} title="Courses">
          <Menu.Item key="2-1">All Courses</Menu.Item>
          <Menu.Item key="2-2">Drafts</Menu.Item>
        </SubMenu>

        <Menu.Item key="3" icon={<TeamOutlined />}>
          Users
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </>
  );
}
