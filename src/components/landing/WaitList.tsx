import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function WaitList() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<"" | "duplicate" | string>("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status !== "idle") setStatus("idle");
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const { error } = await supabase
        .from("waitlist_emails")
        .insert([{ email: email.trim().toLowerCase() }]);
      if (error) {
        if (
          error.code === "23505" ||
          (error.message && error.message.toLowerCase().includes("duplicate"))
        ) {
          setErrorMsg("duplicate");
        } else {
          setErrorMsg("Sorry, something went wrong. Please try again.");
        }
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Sorry, something went wrong. Please try again.");
    }
  };

  const feedbackMessageOpen = Boolean(errorMsg || status === "success");

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl text-white">
            Stay in the Loop
          </h2>
          <p className="mt-4 text-neutral-300">
            Want to be the first to know when GitReads launches and new features are released? Join our waitlist for exclusive status updates and early access.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 max-w-sm lg:mt-12"
            autoComplete="off"
          >
            <div className="bg-neutral-900 has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border border-neutral-700 pr-3 shadow shadow-zinc-950/10 has-[input:focus]:ring-2 transition-shadow">
              <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5 text-neutral-400" />
              <input
                placeholder="Your email address"
                className="h-14 w-full bg-transparent pl-12 focus:outline-none text-white placeholder:text-neutral-500"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                ref={emailInputRef}
                aria-invalid={!!errorMsg}
                aria-describedby="waitlist-feedback"
                disabled={status === "loading" || status === "success"}
              />
              <div className="md:pr-1.5 lg:pr-0">
                <Button
                  aria-label="submit"
                  className="rounded-lg"
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                >
                  {status === "loading" ? (
                    <span>Adding...</span>
                  ) : status === "success" ? (
                    <span>Added!</span>
                  ) : (
                    <span>Join Waitlist</span>
                  )}
                </Button>
              </div>
            </div>
            <div className="relative min-h-12">
              <div
                id="waitlist-feedback"
                aria-live="polite"
                className={`
                  transition-all duration-400 ease-out
                  ${feedbackMessageOpen ? "opacity-100 translate-y-2 mt-3" : "opacity-0 pointer-events-none -translate-y-2"}
                  flex justify-center w-full
                `}
                style={{
                  transitionProperty: "opacity, transform, margin-top",
                }}
              >
                {errorMsg === "duplicate" && (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-yellow-500 bg-neutral-900/95 shadow-md max-w-[95%] mx-auto">
                    <span className="text-yellow-400 text-sm font-semibold">
                      You&apos;re already on the waitlist!
                    </span>
                  </div>
                )}
                {errorMsg && errorMsg !== "duplicate" && (
                  <div className="px-4 py-2 rounded-md border border-red-500 bg-neutral-900/95 text-red-400 text-sm shadow-md max-w-[95%] mx-auto">
                    {errorMsg}
                  </div>
                )}
                {status === "success" && !errorMsg && (
                  <div className="px-4 py-2 rounded-md border border-green-500 bg-neutral-900/95 text-green-400 text-sm font-medium shadow-md max-w-[95%] mx-auto">
                    <span role="status">Thanks! You were added to the waitlist.</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
