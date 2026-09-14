import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { HelpCircle, Search, ClipboardList, Wrench } from "lucide-react";
import Link from "next/link";
import { ServiceRequestForm, LostAndFoundForm, EquipmentRequestForm } from "@/components/services/ServiceForms";
import { format } from "date-fns";

export default async function CampusServicesPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const tab = searchParams.tab || 'helpdesk';

  let serviceRequests = [];
  let lostAndFound = [];
  let equipmentRequests = [];

  if (tab === 'helpdesk') {
    const { data } = await supabase
      .from('service_requests')
      .select('*')
      .eq('student_id', session.user.id)
      .order('created_at', { ascending: false });
    serviceRequests = data || [];
  } else if (tab === 'lost-found') {
    const { data } = await supabase
      .from('lost_and_found')
      .select('*')
      .eq('reported_by', session.user.id)
      .order('created_at', { ascending: false });
    lostAndFound = data || [];
  } else if (tab === 'equipment') {
    const { data } = await supabase
      .from('equipment_requests')
      .select('*')
      .eq('student_id', session.user.id)
      .order('created_at', { ascending: false });
    equipmentRequests = data || [];
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Campus Services</h1>
        <p className="text-gray-400">Manage your support tickets, lost & found reports, and equipment requests.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto custom-scrollbar">
        <Link 
          href="?tab=helpdesk" 
          className={`font-semibold whitespace-nowrap transition-colors ${tab === 'helpdesk' ? 'text-electric-cyan border-b-2 border-electric-cyan pb-4 -mb-[18px]' : 'text-gray-400 hover:text-white'}`}
        >
          Helpdesk
        </Link>
        <Link 
          href="?tab=lost-found" 
          className={`font-semibold whitespace-nowrap transition-colors ${tab === 'lost-found' ? 'text-electric-cyan border-b-2 border-electric-cyan pb-4 -mb-[18px]' : 'text-gray-400 hover:text-white'}`}
        >
          Lost & Found
        </Link>
        <Link 
          href="?tab=equipment" 
          className={`font-semibold whitespace-nowrap transition-colors ${tab === 'equipment' ? 'text-electric-cyan border-b-2 border-electric-cyan pb-4 -mb-[18px]' : 'text-gray-400 hover:text-white'}`}
        >
          Equipment & Lab Access
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {tab === 'helpdesk' && <ServiceRequestForm />}
          {tab === 'lost-found' && <LostAndFoundForm />}
          {tab === 'equipment' && <EquipmentRequestForm />}
        </div>

        <div className="lg:col-span-2">
          {tab === 'helpdesk' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">My Requests</h3>
              {serviceRequests.length > 0 ? (
                serviceRequests.map((req: any) => (
                  <div key={req.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-white text-lg">{req.title}</h4>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{req.description}</p>
                      <div className="flex gap-3 mt-3 text-xs">
                        <span className="text-gray-500">{format(new Date(req.created_at), "MMM d, yyyy")}</span>
                        <span className="capitalize px-2 py-0.5 rounded bg-white/5 text-gray-300 font-medium">{req.request_type}</span>
                        <span className={`capitalize px-2 py-0.5 rounded font-bold ${
                          req.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          req.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>{req.priority} Priority</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                      req.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 
                      req.status === 'in_progress' ? 'bg-electric-blue/20 text-electric-cyan' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState 
                  title="No requests yet" 
                  description="You haven't submitted any service requests. Use the form to submit one."
                  icon={<ClipboardList size={32} />}
                />
              )}
            </div>
          )}

          {tab === 'lost-found' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">My Reports</h3>
              {lostAndFound.length > 0 ? (
                lostAndFound.map((item: any) => (
                  <div key={item.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          item.type === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {item.type}
                        </span>
                        <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex gap-3 mt-3 text-xs">
                        <span className="text-gray-500">Reported: {format(new Date(item.created_at), "MMM d, yyyy")}</span>
                        <span className="text-gray-400 font-medium">Location: {item.location}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                      item.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState 
                  title="No reports yet" 
                  description="You haven't reported any lost or found items."
                  icon={<Search size={32} />}
                />
              )}
            </div>
          )}

          {tab === 'equipment' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">My Requests</h3>
              {equipmentRequests.length > 0 ? (
                equipmentRequests.map((req: any) => (
                  <div key={req.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-electric-violet/20 text-electric-violet">
                          {req.request_type.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-white text-lg">{req.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{req.purpose || req.description}</p>
                      <div className="flex gap-3 mt-3 text-xs flex-wrap">
                        {req.equipment_name && <span className="text-gray-400 font-medium">Equip: {req.equipment_name}</span>}
                        {req.lab_name && <span className="text-gray-400 font-medium">Lab: {req.lab_name}</span>}
                        {req.date_needed && <span className="text-electric-cyan font-medium">Needed: {format(new Date(req.date_needed), "MMM d, yyyy")} {req.time_slot}</span>}
                      </div>
                      
                      {req.coordinator_notes && (
                        <div className="mt-3 bg-black/40 border border-white/5 p-3 rounded-lg text-sm text-gray-300">
                          <span className="text-xs font-bold text-electric-blue block mb-1">Coordinator Note:</span>
                          {req.coordinator_notes}
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                      req.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                      req.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      req.status === 'returned' || req.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState 
                  title="No equipment requests" 
                  description="You haven't requested any lab access or equipment yet."
                  icon={<Wrench size={32} />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
