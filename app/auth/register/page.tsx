import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const ruParam = params?.returnUrl;
  const ru = Array.isArray(ruParam) ? ruParam[0] : ruParam;
  const to = `/?auth=register${
    ru ? `&returnUrl=${encodeURIComponent(ru)}` : ""
  }`;
  redirect(to);
}
