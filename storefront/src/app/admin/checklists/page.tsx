import { ListChecks } from "lucide-react";

import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export default function AdminChecklistsPage() {
  return (
    <AdminPlaceholder
      icon={ListChecks}
      title="Checklists"
      description="Full create, edit, and delete tools for your catalog will live here, backed by Firestore."
    />
  );
}
