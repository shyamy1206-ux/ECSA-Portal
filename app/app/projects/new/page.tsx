import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProjectForm } from "@/components/projects/NewProjectForm";

export default async function NewProjectPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link href="/app/projects" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors w-fit">
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Create New Project</h1>
        <p className="text-gray-400">Initialize a new project portfolio and recruit teammates.</p>
      </div>

      <NewProjectForm />
    </div>
  );
}
