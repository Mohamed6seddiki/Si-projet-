import { AuthPanel } from "@/components/auth/auth-panel";
import { PublicShell } from "@/components/layout/public-shell";
import { getSafeRedirectPath } from "@/lib/auth/redirect";

type LoginPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const errorParam = query.error;
  const nextParam = query.next;
  const nextPath = getSafeRedirectPath(
    typeof nextParam === "string" ? nextParam : undefined,
  );
  const callbackError =
    typeof errorParam === "string" && errorParam === "callback_failed"
      ? errorParam
      : undefined;

  return (
    <PublicShell authMinimal>
      <AuthPanel callbackError={callbackError} nextPath={nextPath} />
    </PublicShell>
  );
}
