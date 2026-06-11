'use client'

import { useState } from 'react'
import { Search, Edit, Trash2, UserCog, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { deleteUser, updateUserRole } from '@/app/actions/admin'

type UserData = {
  id: string
  name: string | null
  email: string
  role: string | null
  createdAt: Date | null
}

export default function UserTableClient({ initialUsers, currentAdminId }: { initialUsers: UserData[], currentAdminId: string }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null)

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleRoleChange = async (userId: string, currentRole: string) => {
    if (userId === currentAdminId) {
      setMessage({ type: 'error', text: 'Tidak bisa mengubah role akun sendiri' })
      return
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    setIsLoading(true)
    const res = await updateUserRole(userId, newRole)
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setMessage({ type: 'success', text: res.message })
    } else {
      setMessage({ type: 'error', text: res.message })
    }
    setIsLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (userId: string) => {
    if (userId === currentAdminId) {
      setMessage({ type: 'error', text: 'Tidak bisa menghapus akun sendiri' })
      return
    }

    if (confirm('Yakin ingin menghapus pengguna ini secara permanen?')) {
      setIsLoading(true)
      const res = await deleteUser(userId)
      if (res.success) {
        setUsers(users.filter(u => u.id !== userId))
        setMessage({ type: 'success', text: res.message })
      } else {
        setMessage({ type: 'error', text: res.message })
      }
      setIsLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="bg-canvas rounded-xl border border-hairline overflow-hidden">
      <div className="p-6 border-b border-hairline flex flex-col sm:flex-row gap-4 justify-between items-center bg-canvas-cream/50">
        <h2 className="heading-md text-ink">Daftar Pengguna ({users.length})</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-ink-mute absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Cari email atau nama..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full sm:w-64 bg-canvas border border-hairline rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      
      {message && (
        <div className={`m-4 p-3 rounded-lg flex items-center gap-2 text-sm font-semibold ${
          message.type === 'success' ? 'bg-semantic-success/10 text-semantic-success' : 'bg-semantic-error/10 text-semantic-error'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-canvas-cream">
              <th className="p-4 body-strong text-ink">Nama Lengkap</th>
              <th className="p-4 body-strong text-ink">Email</th>
              <th className="p-4 body-strong text-ink">Role</th>
              <th className="p-4 body-strong text-ink">Tanggal Daftar</th>
              <th className="p-4 body-strong text-ink text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-mute body-md">
                  Pengguna tidak ditemukan.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className={`border-b border-hairline hover:bg-canvas-cream/30 transition-colors ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="p-4">
                    <div className="font-semibold text-ink">{u.name || 'Tanpa Nama'}</div>
                  </td>
                  <td className="p-4 text-ink-mute">{u.email}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleRoleChange(u.id, u.role || 'user')}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80 ${
                        u.role === 'admin' 
                          ? 'bg-surface-aubergine text-on-primary' 
                          : 'bg-canvas-lavender text-primary'
                      }`}
                      title="Klik untuk mengubah Role"
                    >
                      {u.role === 'admin' ? <UserCog className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      {u.role}
                    </button>
                  </td>
                  <td className="p-4 text-ink-mute text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button 
                      onClick={() => handleDelete(u.id)}
                      className="text-semantic-error hover:opacity-70 transition-opacity" 
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
