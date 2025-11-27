import { useEffect, useState } from "react";
import { Star } from "lucide-react";

async function fetchRepoStars(
  owner: string,
  repo: string
): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.stargazers_count === "number") {
      return data.stargazers_count;
    }
    return null;
  } catch {
    return null;
  }
}

interface RepoStarsProps {
  owner?: string;
  repo?: string;
}

export function RepoStars({ owner, repo }: RepoStarsProps) {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [starLoading, setStarLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function getStarCount() {
      if (owner && repo) {
        setStarLoading(true);
        const stars = await fetchRepoStars(owner, repo);
        if (!cancelled) {
          setStarCount(stars);
          setStarLoading(false);
        }
      } else {
        setStarCount(null);
        setStarLoading(false);
      }
    }

    getStarCount();

    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  return (
    <span
      className="bg-background border border-border rounded-full px-[7px] py-px flex items-center gap-1 shadow-sm min-w-[36px] h-6 mr-1"
      style={{
        fontSize: "0.75rem",
        boxShadow: "0 1px 2px 0 rgba(16,30,54,.04)",
      }}
    >
      <Star
        size={14}
        fill="currentColor"
        stroke="none"
        className="mr-1 text-yellow-400"
      />
      {starLoading ? (
        <span className="animate-pulse" style={{ width: 18 }}>
          --
        </span>
      ) : starCount !== null ? (
        <span>{starCount.toLocaleString()}</span>
      ) : (
        <span>--</span>
      )}
    </span>
  );
}
