import { useAppStore } from "@/contexts/app.context";
import { Alert } from "antd";

const NotificationContainer = () => {
  const notifications = useAppStore((s) => s.notifications);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 2000,
        width: 300,
      }}
    >
      {notifications.map((n) => (
        <Alert
          key={n.id}
          type={n.type}
          message={n.message}
          showIcon={n.showIcon !== false}
          style={{ marginBottom: 10 }}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
