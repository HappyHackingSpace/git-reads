import { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DocumentMarkdown } from "@/components/document/DocumentMarkdown";
import { RepositoryInputModal } from "@/components/document/RepositoryInputModal";
import { useRepository } from "@/hooks/useRepository";
import { FetchReadme } from "@/lib/github";
import { parseTOC } from "@/lib/parser";
import { type TOCItem, type RepositoryInfo } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  createSession,
  getSession,
  updateSessionAccess,
  deleteSession,
  getSessionTimeRemaining,
} from "@/utils/sessionManager";

function ReadmeSkeleton() {
  return (
    <div className="document-markdown w-full max-w-4xl mx-auto px-2 sm:px-4 [&>h1:first-child]:mt-0 [&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0 [&>h4:first-child]:mt-0 [&>h5:first-child]:mt-0 [&>h6:first-child]:mt-0">
      <Skeleton className="h-11 sm:h-14 w-3/4 mb-4 rounded-md" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-9/12 mb-2" />
      <Skeleton className="h-4 w-2/4 mb-6" />
      <Skeleton className="h-8 sm:h-10 w-1/3 mb-3 rounded-md" />
      <Skeleton className="h-4 w-11/12 mb-2" />
      <Skeleton className="h-4 w-4/6 mb-2" />
      <div className="mb-5 space-y-2">
        <Skeleton className="h-4 w-2/3 mb-2 ml-4" />
        <Skeleton className="h-4 w-2/4 mb-2 ml-4" />
        <Skeleton className="h-4 w-2/5 mb-2 ml-4" />
      </div>
      <Skeleton className="h-8 sm:h-10 w-2/6 mb-3 rounded-md" />
      <Skeleton className="h-4 w-11/12 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <div className="mb-7">
        <Skeleton className="h-4 w-full mb-1 rounded-sm" />
        <Skeleton className="h-4 w-11/12 mb-1 rounded-sm" />
        <Skeleton className="h-4 w-3/5 mb-1 rounded-sm" />
      </div>
      <div className="mb-8">
        <Skeleton className="h-4 w-48 mb-1 rounded" />
        <Skeleton className="h-4 w-96 mb-1 rounded" />
        <Skeleton className="h-4 w-36 mb-1 rounded" />
      </div>
    </div>
  );
}

export default function Page() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { repositoryInfo, setRepositoryInfo } = useRepository();
  const [markdown, setMarkdown] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [repo404, setRepo404] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const activityTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (sessionId) {
      getSession(sessionId).then((session) => {
        if (!isMounted) return;
        if (session) {
          setRepositoryInfo(session.repositoryInfo);
          setCurrentSessionId(sessionId);
        } else {
          setError("Session expired or invalid. Please enter a new repository URL.");
          setShowModal(true);
          navigate("/document", { replace: true });
        }
      });
    } else {
      setShowModal(true);
    }
    return () => { isMounted = false; };
  }, [sessionId, navigate, setRepositoryInfo]);

  useEffect(() => {
    if (!currentSessionId) return;

    let cancelled = false;

    const updateCountdown = async () => {
      const remaining = await getSessionTimeRemaining(currentSessionId);
      if (cancelled) return;
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setError("Session expired. Please enter a new repository URL.");
        setShowModal(true);
        setCurrentSessionId(null);
        navigate("/document", { replace: true });
      }
    };

    updateCountdown();
    countdownTimerRef.current = window.setInterval(updateCountdown, 1000);

    return () => {
      cancelled = true;
      if (countdownTimerRef.current) {
        clearInterval(Number(countdownTimerRef.current));
      }
    };
  }, [currentSessionId, navigate]);

  useEffect(() => {
    if (!currentSessionId) return;

    let cancelled = false;

    const updateActivity = async () => {
      if (!currentSessionId) return;
      const success = await updateSessionAccess(currentSessionId);
      if (cancelled) return;
      if (!success) {
        setError("Session expired. Please enter a new repository URL.");
        setShowModal(true);
        setCurrentSessionId(null);
        navigate("/document", { replace: true });
      }
    };

    const handleActivity = () => {
      updateActivity();

      if (activityTimerRef.current) {
        clearTimeout(Number(activityTimerRef.current));
      }

      activityTimerRef.current = window.setTimeout(() => {
        updateActivity();
      }, 30000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);

    handleActivity();

    return () => {
      cancelled = true;
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);

      if (activityTimerRef.current) {
        clearTimeout(Number(activityTimerRef.current));
      }
    };
  }, [currentSessionId, navigate]);

  useEffect(() => {
    if (!repositoryInfo?.owner || !repositoryInfo?.repo || showModal) {
      if (showModal) {
        setIsLoading(false);
      }
      return;
    }

    let cancelled = false;

    async function loadReadme() {
      try {
        setIsLoading(true);
        setError(null);
        setRepo404(false);
        if (!repositoryInfo) {
          throw new Error("Missing repository info");
        }
        const content = await FetchReadme(repositoryInfo);
        if (cancelled) return;
        setMarkdown(content);

        const parsedTOC = parseTOC(content);
        setTocItems(parsedTOC);
      } catch (err) {
        let errorMessage =
          err instanceof Error ? err.message : "Failed to load README content";
        if (
          errorMessage.toLowerCase().includes("404") ||
          errorMessage.toLowerCase().includes("not found")
        ) {
          setRepo404(true);
          setShowModal(true);
          setRepositoryInfo(null);
          errorMessage = "Repository not found. Please try another URL.";
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadReadme();

    return () => { cancelled = true; };
  }, [repositoryInfo, showModal, setRepositoryInfo]);

  useEffect(() => {
    if (!markdown || isLoading) return;

    function handleScroll() {
      if (!contentRef.current) return;

      const headings = Array.from(
        contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      ) as HTMLElement[];

      if (headings.length === 0) {
        setActiveHeadingId("");
        return;
      }

      const scrollY = window.scrollY;
      const headerOffset = 100;
      const threshold = scrollY + headerOffset;

      let activeHeading: HTMLElement | null = null;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        const headingTop = scrollY + rect.top;

        if (headingTop <= threshold) {
          activeHeading = heading;
          break;
        }
      }

      if (!activeHeading && headings.length > 0) {
        const firstHeading = headings[0];
        const firstRect = firstHeading.getBoundingClientRect();
        if (scrollY + firstRect.top > threshold) {
          setActiveHeadingId("");
          return;
        }
        activeHeading = firstHeading;
      }

      if (activeHeading && activeHeading.id) {
        setActiveHeadingId(activeHeading.id);
      } else {
        setActiveHeadingId("");
      }
    }

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [markdown, isLoading]);

  const getBreadcrumbPath = (): { title: string; id: string }[] => {
    const path: { title: string; id: string }[] = [];

    if (!activeHeadingId || tocItems.length === 0) {
      path.push({ title: "README", id: "" });
      return path;
    }

    const activeIndex = tocItems.findIndex(
      (item) => item.id === activeHeadingId
    );

    if (activeIndex === -1) {
      path.push({ title: "README", id: "" });
      return path;
    }

    const activeItem = tocItems[activeIndex];
    const activeLevel = activeItem.level;

    const pathItems: TOCItem[] = [];

    if (activeLevel > 1) {
      pathItems.push(activeItem);
    }

    for (let i = activeIndex - 1; i >= 0; i--) {
      const item = tocItems[i];
      if (item.level < activeLevel && item.level > 1) {
        const hasHigherLevel = pathItems.some((p) => p.level <= item.level);
        if (!hasHigherLevel) {
          pathItems.unshift(item);
        }
      }
    }

    pathItems.forEach((item) => {
      path.push({ title: item.text, id: item.id });
    });

    if (path.length === 0) {
      path.push({ title: "README", id: "" });
    }

    return path;
  };

  const breadcrumbPath = getBreadcrumbPath();

  const githubUrl =
    repositoryInfo?.owner && repositoryInfo?.repo
      ? `https://github.com/${repositoryInfo.owner}/${repositoryInfo.repo}`
      : null;

  const handleRepositoryChange = async (newRepositoryInfo: RepositoryInfo) => {
    if (currentSessionId) {
      await deleteSession(currentSessionId);
    }

    const newSessionId = await createSession(newRepositoryInfo);

    if (!newSessionId) {
      setError("Failed to create session. Please try again.");
      return;
    }

    setCurrentSessionId(newSessionId);

    navigate(`/document/${newSessionId}`, { replace: true });

    setRepositoryInfo(newRepositoryInfo);
    setShowModal(false);
    setError(null);
    setRepo404(false);
  };

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <RepositoryInputModal
          open={showModal}
          onOpenChange={setShowModal}
          onRepositoryChange={handleRepositoryChange}
          currentRepository={repositoryInfo ?? undefined}
        />
        <header className="bg-background sticky top-0 z-10 flex h-14 md:h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
          <Breadcrumb className="flex-1 min-w-0">
            <BreadcrumbList className="flex-wrap gap-1">
              {breadcrumbPath.map((item, index) => (
                <Fragment key={`${item.id}-${index}`}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden sm:block" />
                  )}
                  <BreadcrumbItem className="max-w-[200px] sm:max-w-none">
                    {item.id && index < breadcrumbPath.length - 1 ? (
                      <BreadcrumbLink
                        href={`#${item.id}`}
                        className="truncate text-xs sm:text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(item.id);
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                      >
                        {item.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="truncate text-xs sm:text-sm">
                        {item.title}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          {currentSessionId && timeRemaining > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span>Session expires in:</span>
              <span
                className={`font-mono ${
                  timeRemaining < 60000 ? "text-destructive" : ""
                }`}
              >
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View this repository on GitHub"
              className="ml-auto flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              title="View this repository on GitHub"
            >
              <GitHubLogoIcon width={24} height={24} />
              <span className="sr-only">View this repository on GitHub</span>
            </a>
          )}
        </header>
        <div
          ref={contentRef}
          className="flex flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12"
        >
          {showModal ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-muted-foreground text-sm sm:text-base px-4 text-center">
                {repo404
                  ? "Repository not found. Please enter a valid GitHub repository URL."
                  : "Please enter a GitHub repository URL."}
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <ReadmeSkeleton />
            </div>
          ) : error ? (
            !repo404 && (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <div className="text-destructive text-sm sm:text-base px-4 text-center">
                  {error}
                </div>
              </div>
            )
          ) : (
            <DocumentMarkdown markdown={markdown} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
