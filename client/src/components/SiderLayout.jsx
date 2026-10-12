import { Layout } from 'antd'

const { Sider } = Layout

function SiderLayout() {
  return (
    <Sider collapsible width={240} role="complementary" aria-label="Sidebar">
      Sidebar
    </Sider>
  )
}

export default SiderLayout