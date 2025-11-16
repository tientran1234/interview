import { memo, useState } from "react";
import {
  WalletOutlined,
  TransactionOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Grid,
  Button,
  Avatar,
  Space,
  Spin,
} from "antd";
import type { MenuProps } from "antd";
import { Link, Outlet, useNavigate } from "react-router";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/constants/path";
import { useGetMeQuery, useLogoutMutation } from "@/hooks/useAuth";
import { getRefreshTokenFromLS } from "@/utils/auth";

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const sidebarItems: MenuProps["items"] = [
  {
    key: "/wallets",
    icon: <WalletOutlined />,
    label: <Link to="/">Ví của tôi</Link>,
  },
  {
    key: "/transactions",
    icon: <TransactionOutlined />,
    label: <Link to="/transactions">Giao dịch</Link>,
  },
  {
    key: "/categories",
    icon: <AppstoreOutlined />,
    label: <Link to="/categories">Danh mục</Link>,
  },
  {
    key: "/reports",
    icon: <BarChartOutlined />,
    label: <Link to={PRIVATE_ROUTES.report}>Báo cáo</Link>,
  },
];

const AppLayoutInner = ({
  breadcrumb = ["Trang chủ"],
}: {
  breadcrumb?: string[];
}) => {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const refreshToken = getRefreshTokenFromLS();

  const getMeQuery = useGetMeQuery();
  const user = getMeQuery.data?.data?.result;
  const handleLogout = () => {
    logoutMutation.mutate(refreshToken, {
      onSuccess: () => {
        window.location.href = PUBLIC_ROUTES.login;
      },
    });
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          color: "#fff",
          fontSize: 18,
          fontWeight: 600,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {!screens.md && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
              onClick={toggleSidebar}
            />
          )}
          💰 MyWallet App
        </div>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="md"
          collapsedWidth={screens.xs ? 0 : 80}
          width={220}
          style={{
            background: colorBgContainer,
            position: "sticky",
            top: 64,
            overflow: "auto",
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["wallets"]}
            items={sidebarItems}
            style={{ paddingTop: 16 }}
          />
          <div
            style={{
              marginTop: 20,
            }}
          >
            {getMeQuery.isLoading ? (
              <Spin size="small" />
            ) : user ? (
              <Space
                size="middle"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Space>
                  <Avatar src={user.avatar_url} srcSet={user.avatar_url}>
                    {user.full_name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  {!collapsed ? (
                    <span style={{ fontWeight: 500 }}>{user.full_name}</span>
                  ) : (
                    <></>
                  )}
                </Space>
                {!collapsed && (
                  <span style={{ fontSize: 12, opacity: 0.8 }}>
                    {user.email}
                  </span>
                )}
                {!collapsed && (
                  <Button
                    type="primary"
                    danger
                    size="small"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                )}
              </Space>
            ) : (
              <Button type="primary" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
            )}
          </div>
        </Sider>

        {/* CONTENT */}
        <Layout
          style={{
            padding: screens.xs ? "0 12px 12px" : "0 24px 24px",
          }}
        >
          {!screens.xs && (
            <Breadcrumb
              items={breadcrumb.map((title) => ({ title }))}
              style={{ margin: "16px 0" }}
            />
          )}

          <Content
            style={{
              padding: screens.xs ? 12 : 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              minHeight: screens.xs ? 200 : 360,
              marginBottom: 24,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const AppLayout = memo(AppLayoutInner);
export default AppLayout;
