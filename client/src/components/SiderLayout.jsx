import { Layout, theme as antdTheme } from "antd";
import { useTheme } from "../context/ThemeContext";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Sider } = Layout;

function SiderLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const { mode } = useTheme();
  const {
    token: { colorText },
  } = antdTheme.useToken();

  return (
    <Sider
      collapsible
      width={240}
      theme={mode}
      role="complementary"
      aria-label="Sidebar"
      style={{
        color: colorText,
      }}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    >
      Sidebar
    </Sider>
  );
}

export default SiderLayout;
