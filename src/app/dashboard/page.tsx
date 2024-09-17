import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // If user is not loggedIn
  if(!user || !user.id){
    redirect('/auth-callback?origin=dashboard')
  }
  
  const dbUser = await db.user.findFirst({
    where:{
      id:user.id
    }
  })
  
  // If user is logged in but not synced to our DB
  if(!dbUser){
    redirect('/auth-callback?origin=dashboard')
  }


  return <Dashboard />;
};

export default Page;
