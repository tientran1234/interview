import React from "react";
import { Card, Space, Button, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { getOauthGoogleUrl } from "@/utils/auth";

const { Title, Text } = Typography;

const App: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Card
        style={{
          width: 360,
          borderRadius: 12,
          boxShadow:
            "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={20}>
          <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              Welcome back!
            </Title>
            <Text type="secondary">Login to continue</Text>
          </div>

          <Button
            type="default"
            icon={<GoogleOutlined />}
            onClick={() => (window.location.href = getOauthGoogleUrl())}
            size="large"
            block
            style={{
              height: 48,
              fontSize: 16,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Login with Google
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default App;
