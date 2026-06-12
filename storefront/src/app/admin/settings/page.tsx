import { Settings } from "lucide-react";

import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholder
      icon={Settings}
      title="Settings"
      description="Store configuration, payment/WhatsApp integration, and team management will live here."
    />
  );
}
