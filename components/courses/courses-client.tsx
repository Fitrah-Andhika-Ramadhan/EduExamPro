'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, BookOpen, Video, FileText, PlayCircle, Lock } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'

type CourseType = {
  id: number
  title: string
  description: string
  price: number | null
  originalPrice: number | null
  topics: { title: string; type: string }[]
}

type CoursesClientProps = {
  courses: CourseType[]
  userPlan: string
  userRole: string
  myPurchases?: string[]
  isPublic: boolean
}

export default function CoursesClient({ 
  courses, 
  userPlan, 
  userRole, 
  myPurchases = [],
  isPublic
}: CoursesClientProps) {
  const router = useRouter()
  const purchasesSet = new Set(myPurchases)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {courses.map((course, index) => {
        const isLocked = userPlan === 'free' && userRole !== 'admin' && index >= 1 && !purchasesSet.has(String(course.id))
        const isPurchased = purchasesSet.has(String(course.id)) || userPlan === 'pro' || userRole === 'admin'

        return (
          <div 
            key={course.id} 
            className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className={`h-48 relative p-6 flex flex-col justify-between overflow-hidden ${
              isLocked ? 'bg-gradient-to-br from-gray-100 to-gray-50' : 'bg-gradient-to-br from-indigo-600 to-blue-700'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 flex justify-between items-start">
                <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${
                  isLocked ? 'bg-white/50 text-gray-600 border-gray-200' : 'bg-white/20 text-white border-white/20'
                }`}>
                  Kursus Online
                </span>
                {isLocked && !isPurchased && (
                  <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border bg-amber-500/20 text-amber-600 border-amber-500/20 backdrop-blur-sm flex items-center gap-1">
                    <Lock className="w-3 h-3"/> Premium
                  </span>
                )}
              </div>
              <PlayCircle className={`w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 ${
                isLocked ? 'text-gray-400' : 'text-white'
              }`} />
            </div>

            <div className="p-6 flex flex-col flex-1 bg-white relative z-20">
              <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[3.5rem]">
                {course.title}
              </h3>
              
              <div className="mb-4">
                {course.price != null ? (
                  <div className="flex flex-col">
                    {course.originalPrice != null && course.originalPrice > course.price && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">Rp {course.originalPrice.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-md">Diskon</span>
                      </div>
                    )}
                    <span className="text-2xl font-black text-indigo-600">Rp {course.price.toLocaleString('id-ID')}</span>
                  </div>
                ) : isLocked ? (
                  <span className="flex items-center gap-1.5 text-amber-500 text-xl font-black"><Lock className="w-5 h-5"/> Premium</span>
                ) : (
                  <span className="text-2xl font-black text-indigo-600">Gratis</span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                {course.description}
              </p>

              <div className="space-y-3 mb-8 mt-auto">
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Materi Termasuk:</div>
                {course.topics.slice(0, 3).map((topic, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600 mt-0.5">
                      {topic.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm text-gray-600 font-medium leading-snug">{topic.title}</span>
                  </div>
                ))}
                {course.topics.length > 3 && (
                  <div className="text-xs font-bold text-indigo-600 pt-2">+ {course.topics.length - 3} materi lainnya</div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                {!isPurchased && course.price != null ? (
                   <button 
                     onClick={() => {
                       useCartStore.getState().addItem({
                         id: String(course.id),
                         title: course.title,
                         price: course.price!,
                         type: 'course'
                       })
                       router.push('/cart')
                     }}
                     className="flex-1 text-center py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
                   >
                     Beli Kursus ➔
                   </button>
                ) : (
                  <Link 
                    href={isLocked ? '/choose-plan' : (isPublic ? '/sign-in' : `/courses/material/${course.id}`)}
                    className={`flex-1 text-center py-3 rounded-xl font-bold text-sm transition-all ${
                      isLocked 
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {isLocked ? 'Buka Kunci Premium' : (isPublic ? 'Masuk untuk Akses ➔' : 'Mulai Belajar ➔')}
                  </Link>
                )}
                
                {!isPurchased && course.price != null && (
                  <button 
                    onClick={() => {
                      useCartStore.getState().addItem({
                        id: String(course.id),
                        title: course.title,
                        price: course.price!,
                        type: 'course'
                      })
                      alert('Berhasil ditambahkan ke keranjang!')
                    }}
                    className="w-12 h-12 rounded-xl border border-gray-200 text-indigo-600 flex items-center justify-center hover:border-indigo-600 hover:bg-indigo-50 transition-all shrink-0"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
