import { buttonVariants } from "@/shared/componets/ui";
import Link from "next/link";


export default function Home() {
  return (
    <div className="space-5 text-center">
      <h1 className="text4-4xl font-bold">Welcome to Lendower</h1>

      <Link href="/auth/login" className={buttonVariants()}>Login</Link>
    </div>
  );
}
