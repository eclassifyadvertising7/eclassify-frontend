import { Users, BookOpen, DollarSign, Award } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Active Ads",
    value: "2,284",
    change: "+8.2%",
    changeType: "positive",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    title: "Packages ",
    value: "3",
    change: "+5.1%",
    changeType: "positive",
    icon: Award,
    color: "bg-purple-500",
  },
  {
    title: "Revenue",
    value: "$89,432",
    change: "+15.3%",
    changeType: "positive",
    icon: DollarSign,
    color: "bg-orange-500",
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              {/* <p className={`text-sm mt-2 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from last month
              </p> */}
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
