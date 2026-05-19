'use client';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { ChevronDown, Circle } from 'lucide-react';

function DocumentRequestContent() {
  return (
    <section className="rounded-[18px] border border-slate-200/70 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6">
      <h1 className="text-[30px] font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-[40px]">Document Request</h1>
      <p className="mt-3 text-[18px] text-[#58739b]">Submit official document requests</p>

      <div className="mt-5 rounded-[16px] border border-slate-200/70 bg-white p-4 sm:p-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Document Details</h2>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-2 block text-[16px] font-medium text-slate-900">Document Type <span className="text-[#ef4444]">*</span></span>
            <div className="relative">
              <select className="h-12 w-full appearance-none rounded-[12px] border border-slate-200 bg-white px-4 text-[16px] text-slate-400 outline-none">
                <option>Select document type</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-[16px] font-medium text-slate-900">Number of Copies <span className="text-[#ef4444]">*</span></span>
            <input type="number" defaultValue={1} className="h-12 w-full rounded-[12px] border border-slate-200 px-4 text-[16px] outline-none" />
          </label>

          <label className="block">
            <span className="mb-2 block text-[16px] font-medium text-slate-900">Purpose of Request <span className="text-[#ef4444]">*</span></span>
            <textarea rows={6} placeholder="e.g., Employment, Further Studies" className="w-full rounded-[12px] border border-slate-200 px-4 py-3 text-[16px] outline-none" />
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-slate-200/70 bg-white p-4 sm:p-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Delivery Method</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-[12px] border border-slate-200 px-4 py-3">
            <Circle className="mt-1 h-4 w-4 text-slate-400" />
            <span>
              <span className="block text-[16px] font-bold text-slate-950">Pick-up at Office</span>
              <span className="block text-[13px] text-[#58739b]">FREE</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-[12px] border border-slate-200 px-4 py-3">
            <Circle className="mt-1 h-4 w-4 text-slate-400" />
            <span>
              <span className="block text-[16px] font-bold text-slate-950">Courier Delivery</span>
              <span className="block text-[13px] text-[#58739b]">P150 shipping fee</span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-slate-200/70 bg-white p-4 sm:p-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Payment Gateway</h2>
        <p className="mt-2 text-[15px] text-[#58739b]">Payment integration placeholder for online checkout and reference code capture.</p>
        <div className="mt-4 rounded-[12px] border border-dashed border-[#d8e3ff] bg-[#f7fbff] px-4 py-4">
          <div className="text-[16px] font-bold text-slate-950">Coming Soon</div>
          <p className="mt-1 text-[15px] text-[#58739b]">GCash, Credit/Debit Card, and Bank Transfer options will be available here.</p>
        </div>
      </div>

      <label className="mt-4 flex items-start gap-3 rounded-[12px] border border-slate-200 bg-white p-4">
        <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-[#356dff]" />
        <span>
          <span className="block text-[15px] font-bold uppercase tracking-[0.03em] text-slate-900">Data Privacy Notice <span className="text-[#ef4444]">*</span></span>
          <span className="mt-1 block text-[15px] leading-relaxed text-[#58739b]">I authorize Campus One to collect and process my personal information for document request purposes in accordance with the Data Privacy Act of 2012.</span>
        </span>
      </label>

      <button className="mt-4 h-14 w-full rounded-[16px] bg-[#356dff] text-[16px] font-semibold text-white shadow-sm">Submit Request</button>
    </section>
  );
}

export default function DocumentRequestPage() {
  return <ProtectedRoute allowedRoles={['alumni']}><DocumentRequestContent /></ProtectedRoute>;
}
