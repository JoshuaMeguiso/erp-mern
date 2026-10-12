import { Layout } from "antd";
import SiderLayout from "./SiderLayout";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";

const { Content } = Layout;

function MainLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SiderLayout />
      <Layout style={{ display: "flex", flexDirection: "column" }}>
        <HeaderLayout />
        <Content style={{ flex: 1 }}>
          <main>Content</main>
        </Content>
        <FooterLayout />
      </Layout>
    </Layout>
  );
}

export default MainLayout;
