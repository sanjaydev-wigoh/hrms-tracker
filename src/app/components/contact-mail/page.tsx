'use client';

import { useEffect, useState } from 'react';
import WigohLoader from '../wigohLoader';

interface User {
  id: string;
  email: string;
  username?: string;
}

export default function AllUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/emails')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-2xl border shadow bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">📧 All Users Emails</h2>

      {loading ? (
      <WigohLoader/>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-orange-400 text-white text-left">
                <th className="px-6 py-3 font-semibold">#</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Username</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className={i % 2 === 0 ? 'bg-purple-50' : 'bg-orange-50'}
                >
                     <td className="px-6 py-3 font-medium text-gray-800">{i + 1}</td>
      <td className="px-6 py-3 text-purple-700 flex items-center gap-2">
        {user.email}
        <a
          href={`mailto:${user.email}`}
          title={`Send email to ${user.email}`}
          className="text-blue-500 hover:text-blue-700"
          onClick={(e) => e.stopPropagation()}
        >
          📧
        </a>
      </td>
                  {/* <td className="px-6 py-3 font-medium text-gray-800">{i + 1}</td> */}
                  {/* <td className="px-6 py-3 text-purple-700">{user.email}</td> */}
                  <td className="px-6 py-3 text-orange-700">
                    {user.username || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
