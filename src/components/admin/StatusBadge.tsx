export function StatusBadge({ status }: { status: string }) {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Confirmed':
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Pending':
      colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Completed':
      colorStyles = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Cancelled':
      colorStyles = 'bg-slate-100 text-slate-600 border-slate-300';
      break;
    case 'Rejected':
      colorStyles = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'New':
      colorStyles = 'bg-teal-50 text-teal-700 border-teal-200';
      break;
    case 'Read':
      colorStyles = 'bg-cyan-50 text-cyan-700 border-cyan-200';
      break;
    case 'Resolved':
      colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${colorStyles}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'Confirmed' || status === 'Resolved'
            ? 'bg-emerald-500'
            : status === 'Pending' || status === 'New'
            ? 'bg-amber-500'
            : status === 'Completed'
            ? 'bg-blue-500'
            : 'bg-rose-500'
        }`}
      ></span>
      {status}
    </span>
  );
}
