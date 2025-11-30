import UserDetails from "@/components/admin/user-details"

export default function UserDetailsPage({ params }) {
  return <UserDetails userId={params.id} />
}
