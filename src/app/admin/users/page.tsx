import { ProfileService } from "@/services/profile-service";
import { formatDate } from "@/lib/utils";
import {
  User,
  Users,
  Shield,
  Crown,
  Phone,
  Search,
  Sparkles,
  TrendingUp,
  UserPlus,
  MoreHorizontal,
  ChevronRight,
  Zap,
} from "lucide-react";

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
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-blue-500 via-cyan-400 to-teal-400",
  "from-emerald-500 via-green-400 to-lime-400",
  "from-orange-500 via-amber-400 to-yellow-400",
  "from-pink-500 via-rose-400 to-red-400",
  "from-indigo-500 via-blue-400 to-cyan-400",
  "from-fuchsia-500 via-pink-400 to-rose-400",
  "from-cyan-500 via-teal-400 to-emerald-400",
];

const darkAvatarGradients = [
  "from-violet-600 via-purple-600 to-fuchsia-600",
  "from-blue-600 via-cyan-500 to-teal-500",
  "from-emerald-600 via-green-500 to-lime-500",
  "from-orange-600 via-amber-500 to-yellow-500",
  "from-pink-600 via-rose-500 to-red-500",
  "from-indigo-600 via-blue-500 to-cyan-500",
  "from-fuchsia-600 via-pink-500 to-rose-500",
  "from-cyan-600 via-teal-500 to-emerald-500",
];

export default async function AdminUsersPage() {
  const profileService = new ProfileService(true);
  const { data: profiles } = await profileService.getProfiles({ limit: 1000 });

  const total = (profiles || []).length;
  const admins = (profiles || []).filter((p: any) => p.role === "admin").length;
  const regularUsers = total - admins;

  // Calculate new users this week (mock - adjust based on your data)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = (profiles || []).filter(
    (p: any) => new Date(p.created_at) > oneWeekAgo
  ).length;

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Light mode gradients */}
        <div className="dark:opacity-0 transition-opacity duration-500">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/40 via-purple-200/30 to-fuchsia-200/40 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-blue-200/30 via-cyan-200/20 to-teal-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-pink-200/25 via-rose-200/20 to-orange-200/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Dark mode gradients */}
        <div className="opacity-0 dark:opacity-100 transition-opacity duration-500">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-violet-900/20 via-purple-900/15 to-fuchsia-900/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-blue-900/15 via-cyan-900/10 to-teal-900/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-pink-900/10 via-rose-900/10 to-orange-900/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header Section */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Animated Icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/25 dark:shadow-violet-500/15 transform group-hover:scale-105 transition-all duration-300">
                <Users className="w-7 h-7 text-white drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg animate-bounce-slow">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">
                User Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span>
                  {total} total users &middot; {newThisWeek} joined this week
                </span>
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-violet-500" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full sm:w-72 pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: total,
            icon: Users,
            gradient: "from-violet-500 to-purple-600",
            bgGradient:
              "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
            iconBg: "bg-violet-100 dark:bg-violet-900/40",
            delay: "0s",
          },
          {
            label: "Administrators",
            value: admins,
            icon: Shield,
            gradient: "from-amber-500 to-orange-600",
            bgGradient:
              "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
            iconBg: "bg-amber-100 dark:bg-amber-900/40",
            delay: "0.1s",
          },
          {
            label: "Regular Users",
            value: regularUsers,
            icon: User,
            gradient: "from-blue-500 to-cyan-600",
            bgGradient:
              "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
            iconBg: "bg-blue-100 dark:bg-blue-900/40",
            delay: "0.2s",
          },
          {
            label: "New This Week",
            value: newThisWeek,
            icon: UserPlus,
            gradient: "from-emerald-500 to-teal-600",
            bgGradient:
              "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
            delay: "0.3s",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="group relative animate-fade-in-up"
            style={{ animationDelay: stat.delay }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            />
            <div
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/60 dark:border-gray-700/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.iconBg} p-3 rounded-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <stat.icon
                    className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text`}
                    style={{
                      stroke: `url(#gradient-${i})`,
                    }}
                  />
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient
                        id={`gradient-${i}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          className={
                            stat.gradient.includes("violet")
                              ? "text-violet-500"
                              : stat.gradient.includes("amber")
                                ? "text-amber-500"
                                : stat.gradient.includes("blue")
                                  ? "text-blue-500"
                                  : "text-emerald-500"
                          }
                          stopColor="currentColor"
                        />
                        <stop
                          offset="100%"
                          className={
                            stat.gradient.includes("purple")
                              ? "text-purple-600"
                              : stat.gradient.includes("orange")
                                ? "text-orange-600"
                                : stat.gradient.includes("cyan")
                                  ? "text-cyan-600"
                                  : "text-teal-600"
                          }
                          stopColor="currentColor"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                <span>+12% from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="animate-fade-in-up animation-delay-400">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 dark:from-violet-500/5 dark:via-purple-500/5 dark:to-fuchsia-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
            {/* Table Header Gradient Line */}
            <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50/90 via-gray-50/50 to-gray-100/90 dark:from-gray-800/90 dark:via-gray-800/50 dark:to-gray-800/90">
                    <th className="text-left py-5 px-6 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
                        User
                      </div>
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full" />
                        Phone
                      </div>
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full" />
                        Role
                      </div>
                    </th>
                    <th className="text-left py-5 px-6 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                        Joined
                      </div>
                    </th>
                    <th className="text-right py-5 px-6 font-semibold text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(profiles || []).map((profile: any, index: number) => {
                    const gradient =
                      avatarGradients[
                        profile.id.charCodeAt(0) % avatarGradients.length
                      ];

                    return (
                      <tr
                        key={profile.id}
                        className="group hover:bg-gradient-to-r hover:from-violet-50/50 hover:via-purple-50/30 hover:to-fuchsia-50/50 dark:hover:from-violet-900/10 dark:hover:via-purple-900/5 dark:hover:to-fuchsia-900/10 transition-all duration-300"
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${index * 0.03}s both`,
                        }}
                      >
                        {/* User */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {/* Avatar glow */}
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                              />
                              <div
                                className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                              >
                                <span className="text-white font-bold text-sm drop-shadow-md">
                                  {getInitials(profile.full_name)}
                                </span>
                                {profile.role === "admin" && (
                                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg animate-bounce-slow">
                                    <Crown className="w-3 h-3 text-amber-900" />
                                  </span>
                                )}
                              </div>
                              {/* Online indicator */}
                              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm">
                                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors duration-200 flex items-center gap-2">
                                {profile.full_name || "Anonymous"}
                                {profile.role === "admin" && (
                                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                )}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                {profile.id.slice(0, 12)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-4 px-6">
                          {profile.phone ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-all duration-300">
                              <Phone className="w-4 h-4" />
                              <span className="font-medium">
                                {profile.phone}
                              </span>
                            </span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600 italic">
                              Not provided
                            </span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                              profile.role === "admin"
                                ? "bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/50 shadow-sm shadow-amber-500/10"
                                : "bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-600/50"
                            } transform group-hover:scale-105 transition-all duration-300`}
                          >
                            {profile.role === "admin" ? (
                              <Shield className="w-3.5 h-3.5" />
                            ) : (
                              <User className="w-3.5 h-3.5" />
                            )}
                            {profile.role}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {formatDate(profile.created_at)}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              {new Date(profile.created_at).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-300 transform hover:scale-105 group/btn">
                            <span className="text-xs font-medium">View</span>
                            <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50/90 via-gray-50/50 to-gray-100/90 dark:from-gray-800/90 dark:via-gray-800/50 dark:to-gray-800/90 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-bold text-gray-900 dark:text-white px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded-md">
                      {total}
                    </span>{" "}
                    user{total !== 1 && "s"}
                  </p>
                </div>

                {/* Stacked Avatars */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {(profiles || []).slice(0, 6).map((p: any, i: number) => (
                      <div
                        key={p.id}
                        className={`relative w-8 h-8 rounded-full bg-gradient-to-br ${
                          avatarGradients[
                            p.id.charCodeAt(0) % avatarGradients.length
                          ]
                        } border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-md transform hover:scale-110 hover:-translate-y-1 hover:z-10 transition-all duration-200 cursor-pointer`}
                        style={{
                          animationDelay: `${i * 0.05}s`,
                        }}
                      >
                        <span className="text-white text-[10px] font-bold">
                          {getInitials(p.full_name)}
                        </span>
                      </div>
                    ))}
                    {total > 6 && (
                      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-md transform hover:scale-110 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                        <span className="text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                          +{total - 6}
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-medium shadow-lg shadow-violet-500/25 transform hover:scale-105 transition-all duration-300">
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(30px, 10px) scale(1.05);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 15s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}