import { ProfileService } from "@/services/profile-service";
import { formatDate } from "@/lib/utils";
import { User, Users, Shield, Crown, Phone } from "lucide-react";

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarGradients = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

export default async function AdminUsersPage() {
  const profileService = new ProfileService(true);
  const { data: profiles } = await profileService.getProfiles({ limit: 1000 });

  const total = (profiles || []).length;
  const admins = (profiles || []).filter((p: any) => p.role === "admin").length;

  return (
    <div className="relative">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-[fadeInDown_0.5s_ease-out]">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold bg-linear-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Users
          </h1>
          <p className="text-sm text-gray-500">
            {total} total &middot; {admins} admin{admins !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 overflow-hidden animate-[fadeInUp_0.6s_ease-out]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-linear-to-r from-gray-50/80 to-gray-100/50">
                <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {(profiles || []).map((profile: any, index: number) => {
                const gradient =
                  avatarGradients[
                    profile.id.charCodeAt(0) % avatarGradients.length
                  ];

                return (
                  <tr
                    key={profile.id}
                    className="border-t border-gray-100/80 hover:bg-linear-to-r hover:from-indigo-50/40 hover:to-purple-50/20 transition-all duration-300 group"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative w-10 h-10 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}
                        >
                          <span className="text-white font-bold text-xs">
                            {getInitials(profile.full_name)}
                          </span>
                          {profile.role === "admin" && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                              <Crown className="w-2.5 h-2.5 text-amber-800" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">
                            {profile.full_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {profile.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6">
                      {profile.phone ? (
                        <span className="inline-flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {profile.phone}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                          profile.role === "admin"
                            ? "bg-linear-to-r from-purple-100 to-fuchsia-100 text-purple-700 border border-purple-200/50 shadow-sm shadow-purple-500/10"
                            : "bg-gray-100 text-gray-600 border border-gray-200/50"
                        }`}
                      >
                        {profile.role === "admin" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {profile.role}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="py-4 px-6 text-gray-500">
                      {formatDate(profile.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-linear-to-r from-gray-50/80 to-gray-100/50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">{total}</span> user
            {total !== 1 && "s"}
          </p>
          <div className="flex -space-x-2">
            {(profiles || []).slice(0, 5).map((p: any) => (
              <div
                key={p.id}
                className={`w-6 h-6 rounded-full bg-linear-to-br ${
                  avatarGradients[p.id.charCodeAt(0) % avatarGradients.length]
                } border-2 border-white flex items-center justify-center shadow-sm`}
              >
                <span className="text-white text-[8px] font-bold">
                  {getInitials(p.full_name)}
                </span>
              </div>
            ))}
            {total > 5 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-gray-600 text-[8px] font-bold">
                  +{total - 5}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
