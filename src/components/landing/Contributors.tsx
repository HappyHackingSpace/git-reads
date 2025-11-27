import { Github } from "lucide-react";
import { useEffect, useState } from "react";

type Contributor = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
};

const GITHUB_OWNER = "hazarbakir";
const GITHUB_REPO = "git-reads";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const CONTRIBUTORS_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors`;

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
        };
        if (GITHUB_TOKEN) {
          headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
        }
        const res = await fetch(CONTRIBUTORS_API, { headers });

        if (res.status === 404) {
          throw new Error(
            "Contributors are not available for this repository (404). Try again later or after the repo has activity."
          );
        }

        if (!res.ok) {
          const msg =
            res.status === 403
              ? "GitHub API rate limited. Try again later."
              : "Failed to load contributors.";
          throw new Error(msg);
        }

        const data = await res.json();
        if (!Array.isArray(data))
          throw new Error("Invalid data from GitHub API");

        const cleaned = data
          .filter((c) => c.type === "User")
          .sort((a, b) => b.contributions - a.contributions);

        setContributors(cleaned);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <section className="py-16 md:py-32 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-0">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-2">
            Our Contributors
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            Calling all{" "}
            <span className="inline-flex items-center gap-1 font-semibold italic text-purple-700 dark:text-purple-300 shadow-purple-400/80 drop-shadow-sm animate-[pulse_1.5s_infinite]">
              open sourcerers <span className="text-lg">!</span>
            </span>{" "}
            <strong>GitReads</strong> grows thanks to contributors like you.
            Help us shape smarter, friendlier documentation tools—every
            contribution matters, and everyone’s welcome to join in! <br /> ⭐
          </p>
        </div>

        <div className="mt-14 min-h-[200px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 border-t border-border pt-10 transition-all">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="rounded-full overflow-hidden border-2 border-muted shadow-md w-20 h-20 bg-muted" />
                <div className="h-4 mt-3 w-16 rounded-full bg-muted/50" />
                <div className="h-3 w-10 rounded-full bg-muted/30 mt-1" />
              </div>
            ))}

          {!loading && error && (
            <p className="text-center text-muted-foreground col-span-full">
              {error}
            </p>
          )}

          {!loading && !error && contributors.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full">
              No contributors yet. Be the first!
            </p>
          )}

          {!loading &&
            !error &&
            contributors.map((contributor) => (
              <a
                key={contributor.id}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/80"
                title={`View ${contributor.login} on GitHub`}
              >
                <div className="relative">
                  <div className="rounded-full overflow-hidden border-2 border-muted shadow-md w-20 h-20 bg-muted">
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute right-0 -bottom-1 bg-accent rounded-full p-1 shadow ring-1 ring-accent/10 text-background opacity-80 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                    <Github
                      className="size-4 text-white"
                      aria-label="GitHub profile"
                    />
                  </span>
                </div>

                <span className="mt-3 text-center text-base font-medium text-foreground group-hover:text-accent-foreground transition-colors">
                  {contributor.login}
                </span>
                <span className="text-muted-foreground block text-xs mt-0.5">
                  {contributor.contributions} contribution
                  {contributor.contributions !== 1 ? "s" : ""}
                </span>
              </a>
            ))}
        </div>

        <div className="mt-10 text-center text-muted-foreground text-sm italic">
          {!loading && !error && (
            <>
              (Let's see your face here!{" "}
              <a
                href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
                className="underline underline-offset-2 transition-colors hover:text-accent-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute on GitHub
              </a>
              )
            </>
          )}
          {loading && "Fetching contributors from GitHub..."}
        </div>
      </div>
    </section>
  );
}
