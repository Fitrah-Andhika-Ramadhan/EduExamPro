'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle, Eye, EyeOff, UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react'

type Topic = { title: string; type: string; isCompleted: boolean; isPremium: boolean; url?: string }
type Course = { id: number; title: string; description?: string; isPublished?: boolean; progress: number; topics: Topic[] }

export default function CoursesControlClient() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [draggingCourseIdx, setDraggingCourseIdx] = useState<number | null>(null)
  const [draggingTopicIdx, setDraggingTopicIdx] = useState<number | null>(null)
  const [uploadingTopic, setUploadingTopic] = useState<{ cIdx: number, tIdx: number } | null>(null)

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
        setMessage({ type: 'success', text: 'Perubahan silabus berhasil disimpan!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan perubahan.' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' })
    }
    setIsSaving(false)
  }

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), title: 'Modul Baru', description: '', isPublished: false, progress: 0, topics: [] }])
  }

  const removeCourse = (idx: number) => {
    const newCourses = [...courses]
    newCourses.splice(idx, 1)
    setCourses(newCourses)
  }

  const addTopic = (courseIdx: number) => {
    const newCourses = [...courses]
    newCourses[courseIdx].topics.push({ title: 'Topik Baru', type: 'video', isCompleted: false, isPremium: false, url: '' })
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

  const handleDragStart = (e: React.DragEvent, cIdx: number, tIdx: number) => {
    setDraggingCourseIdx(cIdx)
    setDraggingTopicIdx(tIdx)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDragOver = (e: React.DragEvent, cIdx: number, tIdx: number) => {
    e.preventDefault()
    if (draggingCourseIdx === null || draggingTopicIdx === null) return
    if (draggingCourseIdx !== cIdx) return

    if (draggingTopicIdx !== tIdx) {
      const newCourses = [...courses]
      const topics = newCourses[cIdx].topics
      const [moved] = topics.splice(draggingTopicIdx, 1)
      topics.splice(tIdx, 0, moved)
      setDraggingTopicIdx(tIdx)
      setCourses(newCourses)
    }
  }

  const handleDragEnd = () => {
    setDraggingCourseIdx(null)
    setDraggingTopicIdx(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, cIdx: number, tIdx: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingTopic({ cIdx, tIdx })
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-media', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        updateTopic(cIdx, tIdx, 'url', data.url)
        setMessage({ type: 'success', text: 'File berhasil diunggah' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengunggah' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengunggah' })
    }
    setUploadingTopic(null)
    e.target.value = ''
  }

  if (isLoading) return <div className="text-center py-20 flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" /> Memuat data silabus...</div>

  return (
    <div className="space-y-8 pb-24">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-bold text-gray-800">Daftar Modul Silabus</h2>
          <p className="text-xs text-gray-500">Geser (drag & drop) materi untuk mengatur urutan. Gunakan Draft untuk menyembunyikan modul.</p>
        </div>
        <button onClick={addCourse} className="flex items-center justify-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Tambah Modul
        </button>
      </div>

      <div className="space-y-8">
        {courses.map((course, cIdx) => (
          <div key={course.id} className={`bg-white rounded-2xl border ${course.isPublished !== false ? 'border-indigo-100 shadow-md' : 'border-gray-200 shadow-sm opacity-80'} p-6 relative transition-all`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:absolute sm:top-4 sm:right-4 gap-2 mb-4 sm:mb-0">
              <button 
                onClick={() => updateCourse(cIdx, 'isPublished', course.isPublished === false ? true : false)}
                className={`flex items-center justify-center flex-1 sm:flex-none gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${course.isPublished !== false ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {course.isPublished !== false ? <><Eye className="w-4 h-4"/> Published</> : <><EyeOff className="w-4 h-4"/> Draft</>}
              </button>
              <button onClick={() => removeCourse(cIdx)} className="bg-red-50 text-red-600 p-1.5 rounded-lg hover:bg-red-100 transition-colors flex justify-center items-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4 pr-32">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Modul</label>
              <input 
                value={course.title}
                onChange={e => updateCourse(cIdx, 'title', e.target.value)}
                placeholder="Judul Modul..."
                className="w-full text-2xl font-black text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-500 outline-none pb-1 transition-colors"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi Pendek</label>
              <textarea 
                value={course.description || ''}
                onChange={e => updateCourse(cIdx, 'description', e.target.value)}
                placeholder="Tuliskan deskripsi singkat mengenai modul ini..."
                rows={2}
                className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">Sub-Materi / Topik <span className="bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">{course.topics.length}</span></h3>
                <button onClick={() => addTopic(cIdx)} className="text-xs font-bold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-lg transition-colors">
                  + Tambah Topik
                </button>
              </div>

              <div className="space-y-3">
                {course.topics.map((topic, tIdx) => {
                  const isDragging = draggingCourseIdx === cIdx && draggingTopicIdx === tIdx;
                  const isUploading = uploadingTopic?.cIdx === cIdx && uploadingTopic?.tIdx === tIdx;
                  
                  return (
                    <div 
                      key={tIdx} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, cIdx, tIdx)}
                      onDragOver={(e) => handleDragOver(e, cIdx, tIdx)}
                      onDragEnd={handleDragEnd}
                      className={`group flex flex-col gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm transition-all ${isDragging ? 'opacity-40 border-indigo-400 scale-[0.98]' : 'hover:border-indigo-200'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 shrink-0">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          
                          <input 
                            value={topic.title}
                            onChange={e => updateTopic(cIdx, tIdx, 'title', e.target.value)}
                            placeholder="Judul Materi..."
                            className="flex-1 font-semibold text-sm border-b border-gray-200 hover:border-gray-300 focus:border-indigo-500 outline-none pb-1"
                          />
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 ml-8 md:ml-0">
                          <select 
                            value={topic.type}
                            onChange={e => updateTopic(cIdx, tIdx, 'type', e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-gray-50 focus:border-indigo-500 font-medium w-full sm:w-auto"
                          >
                            <option value="video">Video Materi</option>
                            <option value="live">Live Mentoring</option>
                            <option value="document">PDF/Doc</option>
                            <option value="quiz">Kuis</option>
                          </select>

                          <label className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg cursor-pointer border border-amber-200 transition-colors flex-1 sm:flex-none">
                            <input 
                              type="checkbox" 
                              checked={topic.isPremium}
                              onChange={e => updateTopic(cIdx, tIdx, 'isPremium', e.target.checked)}
                              className="rounded text-amber-500"
                            />
                            Premium
                          </label>

                          <button onClick={() => removeTopic(cIdx, tIdx)} className="text-red-400 p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg shrink-0 transition-colors ml-auto md:ml-0 border border-transparent md:border-none">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {(topic.type === 'video' || topic.type === 'document' || topic.type === 'live') && (
                        <div className="mt-2 md:ml-10 flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 w-full">
                            <span className="pl-3 pr-2 text-gray-400"><LinkIcon className="w-4 h-4"/></span>
                            <input 
                              value={topic.url || ''}
                              onChange={e => updateTopic(cIdx, tIdx, 'url', e.target.value)}
                              placeholder="URL Media (Link YouTube / Google Drive / URL PDF)"
                              className="flex-1 text-xs py-2 pr-2 bg-transparent outline-none w-full"
                            />
                          </div>
                          
                          <div className="shrink-0 relative w-full sm:w-auto">
                            <input 
                              type="file" 
                              id={`file-upload-${cIdx}-${tIdx}`}
                              className="hidden" 
                              accept={topic.type === 'video' ? 'video/*' : topic.type === 'document' ? 'application/pdf' : '*/*'}
                              onChange={(e) => handleFileUpload(e, cIdx, tIdx)}
                              disabled={isUploading}
                            />
                            <label 
                              htmlFor={`file-upload-${cIdx}-${tIdx}`}
                              className={`w-full sm:w-auto justify-center flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors border ${
                                isUploading 
                                  ? 'bg-gray-100 text-gray-400 border-gray-200' 
                                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                              }`}
                            >
                              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                              {isUploading ? 'Mengunggah...' : 'Upload File'}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                {course.topics.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-400 font-semibold">Belum ada topik materi. Klik "Tambah Topik".</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 md:pl-64 flex justify-end z-40">
        <div className="w-full flex justify-end px-4">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Menyimpan...' : 'Simpan Silabus'}
          </button>
        </div>
      </div>
    </div>
  )
}
