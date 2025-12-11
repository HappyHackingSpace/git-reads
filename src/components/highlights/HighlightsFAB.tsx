import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { Highlight } from "@/types/highlight";

type HighlightsFABProps = {
  allHighlights: Highlight[];
  pageIndex: number;
  highlightPageCount: number;
  navigateToHighlight: (highlight: Highlight) => void;
};

function getHighlightPage(highlight: Highlight, highlightPageCount: number) {
  const page = highlight.container_xpath?.match(/page:(\d+)/)?.[1];
  if (page) {
    return Math.min(parseInt(page, 10) + 1, highlightPageCount);
  }
  return 1;
}

export default function HighlightsFAB({
  allHighlights,
  highlightPageCount,
  navigateToHighlight,
}: HighlightsFABProps) {
  const [open, setOpen] = useState(false);
  const highlightCount = allHighlights.length;
  const cardRef = useRef<HTMLDivElement>(null);
  const fabButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      const card = cardRef.current;
      const fabBtn = fabButtonRef.current;
      if (
        card &&
        !card.contains(e.target as Node) &&
        fabBtn &&
        !fabBtn.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      <div className="fixed right-7 bottom-7 z-50 flex flex-col items-end select-none">
        <button
          ref={fabButtonRef}
          aria-label="View highlights"
          className={`
            relative flex items-center justify-center rounded-full
            bg-muted/80 border-2 border-border
            w-14 h-14 transition-all
            shadow-lg
            focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
            hover:border-primary
          `}
          onClick={() => setOpen((prev) => !prev)}
          style={{
            transition: "box-shadow 0.15s, border-color 0.15s",
          }}
        >
          <Sparkles className="w-7 h-7 text-primary" />
          {highlightCount > 0 && (
            <span
              className={`
                absolute -top-2 -right-2 min-w-[1.7rem] h-6 px-2 
                rounded-full bg-primary text-primary-foreground 
                text-xs font-semibold flex items-center justify-center 
                border border-background shadow
                select-none
                transition-shadow
              `}
              style={{ zIndex: 2 }}
            >
              {highlightCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div
          ref={cardRef}
          className={`
            fixed right-5 bottom-[92px] z-[60] flex flex-col items-end
            animate-[fadeInUp_0.24s_ease-out]
          `}
        >
          <Card
            className={`
              w-[355px] max-w-[96vw] rounded-2xl shadow-2xl overflow-hidden border
              border-border bg-background/95 dark:bg-background/95 backdrop-blur-lg
              flex flex-col
              animate-[slideInUp_180ms_ease]
            `}
            style={{
              boxShadow: "0 12px 40px 0 rgba(80,80,80,.16)",
            }}
          >
            <div className="flex flex-row items-center justify-between px-5 py-3 border-b border-border bg-background/96 dark:bg-background/90">
              <CardTitle className="text-lg font-semibold tracking-tight flex-1">
                Highlights
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="ml-1 hover:bg-muted rounded-full"
                onClick={() => setOpen(false)}
                aria-label="Close highlights"
              >
                <span className="sr-only">Close highlights</span>
                <svg
                  viewBox="0 0 20 20"
                  width={20}
                  height={20}
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 6l8 8M6 14L14 6" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </Button>
            </div>
            <CardContent className="flex-1 p-0 bg-background flex flex-col">
              <div
                className="px-2 py-2"
                style={{
                  maxHeight: "390px",
                  overflowY: "auto"
                }}
              >
                {allHighlights.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Sparkles className="w-9 h-9 mx-auto mb-3 text-primary/40" />
                    <div className="text-muted-foreground text-base">No highlights yet.</div>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {allHighlights.map((highlight) => (
                      <li key={highlight.id}>
                        <button
                          type="button"
                          className={`
                            w-full text-left flex items-center gap-3 px-3 py-3
                            bg-transparent hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/20
                            transition-colors rounded-[8px] cursor-pointer
                          `}
                          onClick={() => {
                            setOpen(false);
                            navigateToHighlight(highlight);
                          }}
                        >
                          <span
                            className={`
                              inline-block shrink-0 rounded-full h-4 w-4 shadow
                              border-2 border-border
                            `}
                            style={{
                              backgroundColor: highlight.color,
                            }}
                            aria-label="Highlight color"
                          />
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="text-xs text-muted-foreground mb-0.5 leading-[16px]">
                              Page {getHighlightPage(highlight, highlightPageCount)}
                            </div>
                            <div className="text-base text-foreground truncate leading-tight font-medium">
                              {highlight.text_content}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(48px) scale(0.98);
            opacity: 0.3;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            transform: translateY(24px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
