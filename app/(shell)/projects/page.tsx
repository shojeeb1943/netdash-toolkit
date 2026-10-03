import type { Metadata } from "next"
import { canonical } from "@/lib/site"
import { ProjectManager } from "@/components/project-manager"

export const metadata: Metadata = {
  title: { absolute: "Projects & Saved Calculations | LicenBase Tools" },
  description: "Save, organize, and sync your network engineering work",
  // without its own canonical this inherits the root layout's, which points at "/" and folds the page into the homepage
  alternates: { canonical: canonical("/projects") },
  openGraph: {
    title: "Projects & Saved Calculations | LicenBase Tools",
    description: "Save, organize, and sync your network engineering work",
    url: canonical("/projects"),
  },
  robots: { index: false, follow: true },
}

export default function ProjectsPage() {
  return <ProjectManager />
}
