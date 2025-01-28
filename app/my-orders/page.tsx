import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import MyOrdersClient from "./MyOrdersClient";

export default async function MyOrdersPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>You need to log in to view your orders.</p>
      </div>
    );
  }

  const userId = user.id;
  return <MyOrdersClient userId={userId} />;
}
