import type { Metadata } from "next";
import { AllRepos } from "@/components/AllRepos";

export const metadata: Metadata = {
  title: "All Repositories",
  description: "Every public GitHub repository from Muhammad Maaz Kamal - security automation, AI engineering, and client delivery workflows."
};

export default function ReposPage() {
  return <AllRepos />;
}
