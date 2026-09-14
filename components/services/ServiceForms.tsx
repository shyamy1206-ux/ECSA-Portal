"use client";

import { useState } from "react";
import { submitServiceRequest, submitLostAndFound, submitEquipmentRequest } from "@/app/app/services/actions";
import { useToast } from "@/components/ui/Toast";

export function ServiceRequestForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function actionHandler(formData: FormData) {
    setLoading(true);
    try {
      const res = await submitServiceRequest(formData);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast("Service request submitted successfully", 'success');
        const form = document.getElementById('service-form') as HTMLFormElement;
        if (form) form.reset();
      }
    } catch (e) {
      toast("An unexpected error occurred", 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="service-form" action={actionHandler} className="space-y-4 glass p-6 rounded-3xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">New Service Request</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Request Type</label>
          <select name="request_type" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors">
            <option value="technical">Technical Support</option>
            <option value="facility">Facility Maintenance</option>
            <option value="academic">Academic Query</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Priority</label>
          <select name="priority" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Title</label>
        <input type="text" name="title" required minLength={5} placeholder="Brief description of the issue" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Description</label>
        <textarea name="description" required minLength={10} rows={4} placeholder="Please provide detailed information..." className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none"></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full py-3 bg-electric-blue text-navy-900 font-bold rounded-lg hover:bg-electric-cyan transition-colors disabled:opacity-50">
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}

export function LostAndFoundForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function actionHandler(formData: FormData) {
    setLoading(true);
    try {
      const res = await submitLostAndFound(formData);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast("Report submitted successfully", 'success');
        const form = document.getElementById('lf-form') as HTMLFormElement;
        if (form) form.reset();
      }
    } catch (e) {
      toast("An unexpected error occurred", 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="lf-form" action={actionHandler} className="space-y-4 glass p-6 rounded-3xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Report Lost or Found Item</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Report Type</label>
          <select name="type" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors">
            <option value="lost">I Lost Something</option>
            <option value="found">I Found Something</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Date (Lost/Found)</label>
          <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Item Name</label>
          <input type="text" name="title" required minLength={3} placeholder="E.g., Blue Water Bottle" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Location</label>
          <input type="text" name="location" required minLength={3} placeholder="E.g., Library 2nd Floor" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Description (Color, brand, identifying marks)</label>
        <textarea name="description" required minLength={10} rows={3} placeholder="Detailed description of the item..." className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none"></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full py-3 bg-electric-magenta text-white font-bold rounded-lg hover:bg-electric-magenta/80 transition-colors disabled:opacity-50">
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}

export function EquipmentRequestForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function actionHandler(formData: FormData) {
    setLoading(true);
    try {
      const res = await submitEquipmentRequest(formData);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast("Equipment request submitted!", 'success');
        const form = document.getElementById('equip-form') as HTMLFormElement;
        if (form) form.reset();
      }
    } catch (e) {
      toast("An unexpected error occurred", 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="equip-form" action={actionHandler} className="space-y-4 glass p-6 rounded-3xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Equipment / Lab Request</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Request Type</label>
          <select name="request_type" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors">
            <option value="equipment">Equipment Borrow</option>
            <option value="lab_access">Lab Access</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Date Needed</label>
          <input type="date" name="date_needed" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Title</label>
        <input type="text" name="title" required minLength={5} placeholder="E.g., Arduino Mega for IoT Project" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Equipment / Lab Name</label>
          <input type="text" name="equipment_name" placeholder="E.g., Oscilloscope, Electronics Lab" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Time Slot</label>
          <input type="text" name="time_slot" placeholder="E.g., 2:00 PM - 5:00 PM" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Purpose</label>
        <textarea name="purpose" rows={3} placeholder="Describe what you need the equipment/lab for..." className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors resize-none"></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full py-3 bg-electric-violet text-white font-bold rounded-lg hover:bg-electric-violet/80 transition-colors disabled:opacity-50">
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
