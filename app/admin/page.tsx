import { createServerClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp } from "lucide-react"

async function getRSVPStats() {
  const supabase = createServerClient()

  const { data: rsvps, error } = await supabase.from("rsvps").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching RSVPs:", error)
    return { rsvps: [], stats: { total: 0, attending: 0, notAttending: 0, maybe: 0, totalGuests: 0 } }
  }

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter((r) => r.attendance === "Yes").length,
    notAttending: rsvps.filter((r) => r.attendance === "No").length,
    maybe: rsvps.filter((r) => r.attendance === "Maybe").length,
    totalGuests: rsvps.filter((r) => r.attendance === "Yes").reduce((sum, r) => sum + r.number_of_guests, 0),
    teamPink: rsvps.filter((r) => r.team_prediction === "pink" && r.attendance === "Yes").length,
    teamBlue: rsvps.filter((r) => r.team_prediction === "blue" && r.attendance === "Yes").length,
  }

  return { rsvps, stats }
}

export default async function AdminDashboard() {
  const { rsvps, stats } = await getRSVPStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard 📊</h1>
          <p className="text-xl text-gray-600">Gender Reveal Party Management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-gray-600">Total RSVPs</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.attending}</div>
              <div className="text-gray-600">Attending</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.totalGuests}</div>
              <div className="text-gray-600">Total Guests</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center space-x-2 mb-2">
                <span className="text-pink-500">💖</span>
                <span className="text-blue-500">💙</span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {stats.teamPink} vs {stats.teamBlue}
              </div>
              <div className="text-gray-600">Team Predictions</div>
            </CardContent>
          </Card>
        </div>

        {/* RSVP List */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">All RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-700">Name</th>
                    <th className="text-left p-3 font-medium text-gray-700">Email</th>
                    <th className="text-left p-3 font-medium text-gray-700">Attendance</th>
                    <th className="text-left p-3 font-medium text-gray-700">Guests</th>
                    <th className="text-left p-3 font-medium text-gray-700">Team</th>
                    <th className="text-left p-3 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{rsvp.name}</td>
                      <td className="p-3 text-gray-600">{rsvp.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rsvp.attendance === "Yes"
                              ? "bg-green-100 text-green-700"
                              : rsvp.attendance === "No"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {rsvp.attendance}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{rsvp.number_of_guests}</td>
                      <td className="p-3">
                        {rsvp.team_prediction && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rsvp.team_prediction === "pink"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {rsvp.team_prediction === "pink" ? "💖 Pink" : "💙 Blue"}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600 text-sm">{new Date(rsvp.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
