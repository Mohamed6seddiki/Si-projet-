import { AuthPanel } from "@/components/auth/auth-panel";
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
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
      <div className="grid w-full max-w-6xl gap-8 rounded-[2rem] bg-[var(--surface)]/70 p-6 shadow-[0_24px_70px_rgba(4,22,39,0.12)] backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <section className="rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-soft)] p-8 text-white">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
            Avocat-Link
          </span>

          <h1 className="mt-6 max-w-xl text-4xl leading-tight font-semibold sm:text-5xl">
            Connectez-vous rapidement aux avocats adaptes a votre situation.
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-100 sm:text-base">
            Une plateforme claire et securisee pour envoyer vos documents juridiques,
            reserver une consultation et suivre chaque etape de votre dossier.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-200">
                Confidentialite
              </p>
              <p className="mt-2 text-sm text-slate-100">
                Documents PDF prives avec acces restreint.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-200">
                Suivi en direct
              </p>
              <p className="mt-2 text-sm text-slate-100">
                Statut des consultations: en attente, acceptee, terminee.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <AuthPanel callbackError={callbackError} nextPath={nextPath} />
        </section>
      </div>
    </main>
  );
}
