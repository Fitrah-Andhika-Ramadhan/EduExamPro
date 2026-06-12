'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle } from 'lucide-react'

type Topic = { title: string; type: string; isCompleted: boolean; isPremium: boolean }
type Course = { id: number; title: string; progress: number; topics: Topic[] }

export default function CoursesControlClient() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCourses(data.data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courses)
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Perubahan materi silabus berhasil disimpan!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan perubahan.' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' })
    }
    setIsSaving(false)
  }

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), title: 'Modul Baru', progress: 0, topics: [] }])
  }

  const removeCourse = (idx: number) => {
    const newCourses = [...courses]
    newCourses.splice(idx, 1)
    setCourses(newCourses)
  }

  const addTopic = (courseIdx: number) => {
    const newCourses = [...courses]
    newCourses[courseIdx].topics.push({ title: 'Topik Baru', type: 'video', isCompleted: false, isPremium: false })
    setCourses(newCourses)
  }

  const removeTopic = (courseIdx: number, topicIdx: number) => {
    const newCourses = [...courses]
    newCourses[courseIdx].topics.splice(topicIdx, 1)
    setCourses(newCourses)
  }

  const updateCourse = (idx: number, field: keyof Course, value: any) => {
    const newCourses = [...courses]
    newCourses[idx] = { ...newCourses[idx], [field]: value }
    setCourses(newCourses)
  }

  const updateTopic = (courseIdx: number, topicIdx: number, field: keyof Topic, value: any) => {
    const newCourses = [...courses]
    newCourses[courseIdx].topics[topicIdx] = { ...newCourses[courseIdx].topics[topicIdx], [field]: value }
    setCourses(newCourses)
  }

  if (isLoading) return <div className="text-center py-20">Memuat data...</div>

  return (
    <div className="space-y-8 pb-20">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="font-bold text-gray-800">Daftar Modul Silabus</h2>
        <button onClick={addCourse} className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
          <Plus className="w-4 h-4" /> Tambah Modul
        </button>
      </div>

      <div className="space-y-6">
        {courses.map((course, cIdx) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative">
            <button onClick={() => removeCourse(cIdx)} className="absolute top-4 right-4 bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
              <Trash2 className="w-5 h-5" />
            </button>
            
            <div className="mb-4 pr-12">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Modul</label>
              <input 
                value={course.title}
                onChange={e => updateCourse(cIdx, 'title', e.target.value)}
                className="w-full text-xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 outline-none pb-1"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 text-sm">Sub-Materi / Topik ({course.topics.length})</h3>
                <button onClick={() => addTopic(cIdx)} className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                  + Tambah Topik
                </button>
              </div>

              <div className="space-y-2">
                {course.topics.map((topic, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <GripVertical className="w-4 h-4 text-gray-300 cursor-move shrink-0" />
                    
                    <input 
                      value={topic.title}
                      onChange={e => updateTopic(cIdx, tIdx, 'title', e.target.value)}
                      placeholder="Judul Materi"
                      className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 outline-none focus:border-indigo-500"
                    />

                    <select 
                      value={topic.type}
                      onChange={e => updateTopic(cIdx, tIdx, 'type', e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1.5 outline-none bg-gray-50"
                    >
                      <option value="video">Video</option>
                      <option value="document">PDF/Doc</option>
                      <option value="quiz">Kuis</option>
                    </select>

                    <label className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded cursor-pointer border border-amber-200">
                      <input 
                        type="checkbox" 
                        checked={topic.isPremium}
                        onChange={e => updateTopic(cIdx, tIdx, 'isPremium', e.target.checked)}
                        className="rounded text-amber-500"
                      />
                      Premium
                    </label>

                    <button onClick={() => removeTopic(cIdx, tIdx)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 md:pl-64 flex justify-end z-40">
        <div className="max-w-7xl mx-auto w-full flex justify-end px-4 sm:px-6">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan Silabus'}
          </button>
        </div>
      </div>
    </div>
  )
}
