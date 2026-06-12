'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MicOff, VideoOff, Hand, Volume2, MonitorUp, Maximize, Settings, Send, Video as VideoIcon, Users, MessageSquare } from 'lucide-react'

export default function MentoringLiveClient({ topicId }: { topicId: string }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sarah M.', time: '14:32', text: 'Great explanation of React hooks!', isInstructor: false },
    { id: 2, sender: 'Dr. Johnson', time: '14:33', text: 'Thank you! Any questions so far?', isInstructor: true },
    { id: 3, sender: 'Mike R.', time: '14:34', text: 'Can you show the useEffect example again?', isInstructor: false },
    { id: 4, sender: 'Emma L.', time: '14:35', text: 'This is really helpful, thanks!', isInstructor: false },
    { id: 5, sender: 'Dr. Johnson', time: '14:36', text: 'Sure Mike, let me go back to that slide', isInstructor: true },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [duration, setDuration] = useState(45 * 60 + 23) // 45:23 in seconds
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const now = new Date()
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    setMessages([...messages, {
      id: Date.now(),
      sender: 'You',
      time: timeString,
      text: newMessage,
      isInstructor: false
    }])
    setNewMessage('')
    
    // Simulate auto-reply from instructor if user asks something
    if (newMessage.toLowerCase().includes('?')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'Dr. Johnson',
          time: timeString,
          text: 'Good question! I will cover that in the next segment.',
          isInstructor: true
        }])
      }, 2000)
    }
  }

  return (
    <div className="flex h-screen bg-[#111827] text-white font-sans overflow-hidden">
      
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
          <div className="bg-[#1f2937]/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/10 shadow-lg pointer-events-auto">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
              SJ
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Dr. Sarah Johnson</h3>
              <p className="text-xs text-gray-400">Instructor</p>
            </div>
          </div>
          <div className="bg-[#1f2937]/80 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10 font-mono text-sm shadow-lg pointer-events-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Duration: {formatTime(duration)}
          </div>
        </div>

        {/* Video Placeholder Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111827]/50 to-[#111827] pointer-events-none z-0"></div>
          <div className="z-10 flex flex-col items-center text-gray-400">
            <VideoIcon className="w-20 h-20 mb-4 opacity-50" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-white mb-2">Live Stream</h2>
            <p className="text-lg">Dr. Sarah Johnson is presenting</p>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1f2937]/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 z-20">
          <button className="w-12 h-10 rounded-xl flex items-center justify-center bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
            <MicOff className="w-5 h-5" />
          </button>
          <button className="w-12 h-10 rounded-xl flex items-center justify-center bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
            <VideoOff className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1"></div>
          <button className="w-12 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Hand className="w-5 h-5" />
          </button>
          <button className="w-12 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <MonitorUp className="w-5 h-5" />
          </button>
          <button className="w-12 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Maximize className="w-5 h-5" />
          </button>
          <button className="w-12 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="h-16 bg-[#1f2937] border-t border-white/5 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400">Session:</span>
            <span className="font-semibold text-white">Advanced React Patterns</span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-indigo-300 border border-white/10">Chapter 3: Custom Hooks</span>
          </div>
          <Link href="/courses" className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20">
            Leave Session
          </Link>
        </div>
      </div>

      {/* Sidebar Chat Area */}
      <div className="w-80 bg-white text-gray-900 flex flex-col border-l border-gray-200">
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Live Chat
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
            <Users className="w-3.5 h-3.5" />
            127 online
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in">
              <div className="flex items-baseline gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0 uppercase">
                  {msg.sender.substring(0,2)}
                </div>
                <span className={`text-sm font-bold ${msg.isInstructor ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {msg.sender}
                </span>
                {msg.isInstructor && (
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Instructor</span>
                )}
                <span className="text-xs text-gray-400 ml-auto">{msg.time}</span>
              </div>
              <div className="pl-8 text-sm text-gray-600 leading-relaxed">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text" 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">Be respectful and stay on topic</span>
          </div>
        </div>
      </div>
      
    </div>
  )
}
