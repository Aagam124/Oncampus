import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Send,
  MessageSquare,
  Search,
  User,
  Plus,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/Avatar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Messages() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);

  // New message modal
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all user conversations
  const fetchConversations = async (preferredId = null) => {
    try {
      const res = await api.get('/conversations');
      const list = res.data?.data?.conversations || res.data?.conversations || [];
      setConversations(list);

      // Select active conversation
      const targetId = preferredId || location.state?.conversationId || (selectedConv?._id);
      if (targetId) {
        const found = list.find((c) => c._id === targetId);
        if (found) setSelectedConv(found);
        else if (list.length > 0 && !selectedConv) setSelectedConv(list[0]);
      } else if (list.length > 0 && !selectedConv) {
        setSelectedConv(list[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const res = await api.get(`/conversations/${convId}/messages`);
      const msgs = res.data?.data?.messages || res.data?.messages || [];
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  useEffect(() => {
    if (selectedConv?._id) {
      setLoadingMsgs(true);
      fetchMessages(selectedConv._id).finally(() => {
        setLoadingMsgs(false);
        setTimeout(scrollToBottom, 100);
      });
    }
  }, [selectedConv?._id]);

  // Polling every 5 seconds for incoming messages
  useEffect(() => {
    if (!selectedConv?._id) return;
    const interval = setInterval(() => {
      fetchMessages(selectedConv._id);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConv?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConv?._id) return;

    const content = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const res = await api.post(`/conversations/${selectedConv._id}/messages`, { content });
      const newMsg = res.data?.data?.message || res.data?.message;
      if (newMsg) {
        setMessages((prev) => [...prev, newMsg]);
        fetchConversations(selectedConv._id); // Update last message in sidebar
      } else {
        fetchMessages(selectedConv._id);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  // Search users for new conversation
  const handleSearchUsers = async (e) => {
    const q = e.target.value;
    setSearchUserQuery(q);
    if (!q.trim()) {
      setFoundUsers([]);
      return;
    }
    setSearchingUsers(true);
    try {
      const res = await api.get(`/users?search=${encodeURIComponent(q)}&limit=5`);
      const uList = res.data?.data || [];
      setFoundUsers(uList.filter((u) => u._id !== user?._id));
    } catch {
      setFoundUsers([]);
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleStartConversationWith = async (otherUser) => {
    try {
      const res = await api.post('/conversations', { participantId: otherUser._id });
      const conv = res.data?.data?.conversation || res.data?.conversation;
      setNewChatModalOpen(false);
      setSearchUserQuery('');
      setFoundUsers([]);
      await fetchConversations(conv?._id);
      if (conv) setSelectedConv(conv);
    } catch (err) {
      addToast('Could not start conversation', 'error');
    }
  };

  const getCounterparty = (conv) => {
    if (!conv?.participants) return {};
    return conv.participants.find((p) => (p._id || p) !== user?._id) || {};
  };

  const activeCounterparty = getCounterparty(selectedConv);
  const activeCounterpartyName = activeCounterparty.firstName
    ? `${activeCounterparty.firstName} ${activeCounterparty.lastName || ''}`
    : 'Campus Peer';

  return (
    <div className="bg-surface-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-surface-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[780px]">
          {/* LEFT SIDEBAR: Conversations List */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-surface-200 flex flex-col ${
              selectedConv ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Sidebar Header */}
            <div className="p-4 sm:p-5 border-b border-surface-100 flex items-center justify-between">
              <div>
                <h1 className="font-extrabold text-surface-900 text-lg">Messages</h1>
                <p className="text-xs text-surface-400">Direct campus chat</p>
              </div>
              <button
                onClick={() => setNewChatModalOpen(true)}
                className="p-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                title="New Chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-surface-100">
              {loadingConvs ? (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner message="" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-surface-400 text-xs space-y-3">
                  <MessageSquare className="w-8 h-8 mx-auto text-surface-300" />
                  <p>No conversations yet. Connect with a student provider or project lead to chat.</p>
                  <button
                    onClick={() => setNewChatModalOpen(true)}
                    className="text-brand-600 font-semibold hover:underline"
                  >
                    Start a conversation
                  </button>
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = getCounterparty(conv);
                  const name = other.firstName
                    ? `${other.firstName} ${other.lastName || ''}`
                    : 'Campus User';
                  const isSelected = selectedConv?._id === conv._id;

                  return (
                    <button
                      key={conv._id}
                      onClick={() => setSelectedConv(conv)}
                      className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                        isSelected ? 'bg-brand-50/70 border-l-4 border-brand-600' : 'hover:bg-surface-50'
                      }`}
                    >
                      <Avatar src={other.avatar} name={name} size="md" className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-0.5">
                          <h4 className="font-semibold text-sm text-surface-900 truncate">{name}</h4>
                          {conv.lastMessage?.createdAt && (
                            <span className="text-[10px] text-surface-400 flex-shrink-0">
                              {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-surface-500 truncate">
                          {conv.lastMessage?.content || 'Started conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT WORKSPACE: Active Message Thread */}
          <div
            className={`flex-1 flex flex-col bg-surface-50/40 ${
              !selectedConv ? 'hidden md:flex' : 'flex'
            }`}
          >
            {selectedConv ? (
              <>
                {/* Active Header */}
                <div className="p-4 sm:p-5 border-b border-surface-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConv(null)}
                      className="md:hidden p-1 text-surface-500 hover:text-surface-900"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <Avatar
                      src={activeCounterparty.avatar}
                      name={activeCounterpartyName}
                      size="md"
                    />
                    <div>
                      <h3 className="font-bold text-surface-900 text-sm sm:text-base">
                        {activeCounterpartyName}
                      </h3>
                      {activeCounterparty.headline && (
                        <p className="text-xs text-surface-500 truncate max-w-xs sm:max-w-md">
                          {activeCounterparty.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  {activeCounterparty._id && (
                    <Link
                      to={`/users/${activeCounterparty._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 text-xs font-semibold text-surface-700 hover:bg-surface-50 transition-colors"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5">
                  {loadingMsgs ? (
                    <div className="h-full flex items-center justify-center">
                      <LoadingSpinner message="" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-xs text-surface-400">
                      No messages in this conversation yet. Say hello!
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = (msg.sender?._id || msg.sender) === user?._id;
                      const senderName = msg.sender?.firstName || 'User';

                      return (
                        <div
                          key={idx}
                          className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMe && (
                            <Avatar
                              src={msg.sender?.avatar}
                              name={senderName}
                              size="xs"
                              className="mb-1 flex-shrink-0"
                            />
                          )}
                          <div
                            className={`max-w-[70%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                              isMe
                                ? 'bg-brand-600 text-white rounded-br-none shadow-xs'
                                : 'bg-white border border-surface-200 text-surface-900 rounded-bl-none shadow-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <span
                              className={`text-[10px] block mt-1 text-right ${
                                isMe ? 'text-brand-200' : 'text-surface-400'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 bg-white border-t border-surface-200 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputMessage.trim()}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-surface-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center text-surface-400">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-surface-800 text-base">Select a conversation</h3>
                <p className="text-xs max-w-sm">
                  Choose from existing chats on the left, or search for student peers to start a new chat.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {newChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-900">Start a Conversation</h3>
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="text-surface-400 hover:text-surface-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search students by name or skill..."
                value={searchUserQuery}
                onChange={handleSearchUsers}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-surface-300 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-surface-100">
              {searchingUsers ? (
                <p className="text-center text-xs text-surface-400 py-4">Searching students...</p>
              ) : foundUsers.length === 0 ? (
                <p className="text-center text-xs text-surface-400 py-4">
                  {searchUserQuery ? 'No students found.' : 'Type a name to search.'}
                </p>
              ) : (
                foundUsers.map((u) => {
                  const name = `${u.firstName} ${u.lastName || ''}`;
                  return (
                    <button
                      key={u._id}
                      onClick={() => handleStartConversationWith(u)}
                      className="w-full text-left p-3 hover:bg-surface-50 rounded-xl flex items-center gap-3 transition-colors"
                    >
                      <Avatar src={u.avatar} name={name} size="sm" />
                      <div className="overflow-hidden">
                        <p className="font-semibold text-xs text-surface-900 truncate">{name}</p>
                        <p className="text-[11px] text-surface-500 truncate">{u.university}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
