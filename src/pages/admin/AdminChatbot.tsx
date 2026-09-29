import { useState, useEffect } from 'react';
import {
  Bot,
  MessageSquare,
  ShieldCheck,
  Clock,
  Eye,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../services/api.js';

export function AdminChatbot() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChatData = async () => {
    setLoading(true);
    try {
      const [convRes, anaRes] = await Promise.all([
        api.getChatConversations(),
        api.getChatAnalytics(),
      ]);
      if (convRes.success && Array.isArray(convRes.data)) setConversations(convRes.data);
      if (anaRes.success && anaRes.data) setAnalytics(anaRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, []);

  const viewConversationDetails = async (id: string) => {
    try {
      const res = await api.getChatConversationById(id);
      if (res.success && res.data) {
        setSelectedConversation(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout title="Jharna Care Assistant AI Management">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Conversations</span>
              <Bot className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white">
              {analytics?.totalConversations ?? conversations.length}
            </div>
            <span className="text-[11px] text-teal-400 mt-1 block">Patient interactions logged</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Exchanged Messages</span>
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white">
              {analytics?.totalMessages ?? 0}
            </div>
            <span className="text-[11px] text-cyan-400 mt-1 block">Dual-turn dialogue queries</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Safety Engine Guardrails</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-emerald-400">
              Active & Enforced
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Zero diagnosis • Emergency alert on red flags
            </span>
          </div>
        </div>

        {/* Safety Rules Audit Card */}
        <div className="bg-gradient-to-r from-teal-950/60 to-slate-950 p-5 rounded-2xl border border-teal-800/40 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-teal-300">
            <Sparkles className="w-4 h-4" />
            <span>Assistant Safety Constitution Enforced at Runtime:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-400">
            <div>• <strong>No Medical Diagnosis:</strong> Model refuses to diagnose symptoms or illness.</div>
            <div>• <strong>No Drug Prescription:</strong> Prohibited from prescribing medications or doses.</div>
            <div>• <strong>Emergency Escalation:</strong> Immediately directs acute trauma to [Emergency Number].</div>
          </div>
        </div>

        {/* Content: Recent Conversations & Query Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Conversation Sessions List */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Recent Assistant Conversations</h3>
              <button
                onClick={fetchChatData}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-[550px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-500 text-xs">Loading logs...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No chat conversations recorded yet. Use the widget on the public website to test!
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => viewConversationDetails(conv._id)}
                    className="p-4 hover:bg-slate-900/60 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-teal-400">
                        {conv.conversationId}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {conv.messageCount} messages
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {conv.lastMessage || 'Session started'}
                    </p>
                    <div className="text-[10px] text-slate-500">
                      {new Date(conv.updatedAt || conv.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Common Patient Queries */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Patient Questions Asked
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {analytics?.recentQueries && analytics.recentQueries.length > 0 ? (
                analytics.recentQueries.map((q: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs space-y-1"
                  >
                    <p className="text-white font-medium">"{q.query}"</p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(q.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-10">
                  No questions logged yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: View Full Transcript */}
        {selectedConversation && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Conversation Log</h4>
                  <span className="text-[10px] text-teal-400 font-mono">
                    {selectedConversation.conversationId}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-900/50 rounded-2xl border border-slate-800/60 text-xs">
                {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${
                        m.role === 'user'
                          ? 'bg-teal-950/70 border border-teal-800/60 text-teal-100 ml-4'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 mr-4 whitespace-pre-line'
                      }`}
                    >
                      <div className="font-bold text-[10px] text-slate-400 uppercase mb-1">
                        {m.role === 'user' ? 'Patient' : 'Jharna Care Assistant'}
                      </div>
                      <div>{m.content}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500">Empty conversation.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
