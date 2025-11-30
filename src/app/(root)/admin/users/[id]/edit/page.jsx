import UserEdit from "@/components/admin/user-edit"

export default function UserEditPage({ params }) {
  return <UserEdit userId={params.id} />
}
