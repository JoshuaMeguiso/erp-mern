import {
  Layout,
  Input,
  Avatar,
  Flex,
  Breadcrumb,
  Space,
  Dropdown,
  theme as antdTheme,
} from "antd";
import { useTheme } from "../context/ThemeContext";
import {
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  FullscreenOutlined,
  BellOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const HeaderLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    token: {
      colorBgContainer,
      colorBorderSecondary,
      colorTextSecondary,
      colorFillTertiary,
    },
  } = antdTheme.useToken();

  const headerStyle = {
    background: colorBgContainer,
    borderBottom: `1px solid ${colorBorderSecondary}`,
    padding: "0 24px",
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
  };

  const breadcrumbStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: colorTextSecondary,
    fontSize: 14,
    minWidth: 120,
  };

  const actionButtonStyle = {
    border: "none",
    background: "transparent",
    color: colorTextSecondary,
    cursor: "pointer",
    fontSize: 18,
    width: 32,
    height: 32,
    borderRadius: 8,
  };

  const breadcrumbItems = [
    {
      title: "Home",
    },
  ];

  return (
    <Layout.Header role="banner" style={headerStyle}>
      <Flex align="middle" justify="space-between" style={{ width: "100%" }}>
        <Breadcrumb items={breadcrumbItems} style={breadcrumbStyle} />
        <Space align="center">
          <Input
            placeholder="Search menu..."
            allowClear
            style={{
              width: 220,
              borderRadius: 999,
              color: colorTextSecondary,
            }}
          />
          <button type="button" aria-label="Settings" style={actionButtonStyle}>
            <SettingOutlined />
          </button>
          <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
            style={actionButtonStyle}
          >
            {isDark ? <MoonOutlined /> : <SunOutlined />}
          </button>
          <button
            type="button"
            aria-label="Full screen"
            style={actionButtonStyle}
          >
            <FullscreenOutlined />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            style={actionButtonStyle}
          >
            <BellOutlined />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 8px 4px 6px",
              borderRadius: 999,
              background: colorFillTertiary,
            }}
          >
            {/* <div style={{ textAlign: "right", lineHeight: 1.2 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Joshua Meguiso</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Admin</div>
            </div> */}

            <Dropdown
              menu={{
                items: [
                  { key: "profile", label: "Profile", icon: <UserOutlined /> },
                  {
                    key: "settings",
                    label: "Settings",
                    icon: <SettingOutlined />,
                  },
                  {
                    key: "help_center",
                    label: "Help Center",
                    icon: <QuestionCircleOutlined />,
                  },
                  { type: "divider" },
                  {
                    key: "logout",
                    label: "Logout",
                    icon: <LogoutOutlined />,
                    danger: true,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Avatar
                size={28}
                style={{
                  backgroundColor: "#1890ff",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                JM
              </Avatar>
            </Dropdown>
          </div>
        </Space>
      </Flex>
    </Layout.Header>
  );
};

export default HeaderLayout;
