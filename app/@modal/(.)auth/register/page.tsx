"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal/AuthModal";

export default function InterceptedRegister({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const ruParam = params?.returnUrl;
  const ru = Array.isArray(ruParam) ? ruParam[0] : ruParam;

  return (
    <AuthModal
      isOpen
      initialMode="register"
      returnUrl={ru}
      onClose={() => router.back()}
    />
  );
}
