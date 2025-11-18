import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CalendarCheck,
  Brain,
  NotebookTabs,
  Users,
  Github,
  FileText,
} from "lucide-react";
import type { ReactNode } from "react";

export default function Features() {
  return (
    <section className="py-16 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Feature Roadmap
          </h2>
          <p className="mt-4">
            Explore the upcoming features planned for GitReads. Your feedback
            will help shape our direction!
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:transparent] [--color-card:transparent] *:text-center md:mt-16 dark:[--color-muted:transparent]">
          <Card className="group border-0 shadow-none bg-transparent">
            <CardHeader className="pb-3">
              <CardDecorator>
                <CalendarCheck className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Personal To-Do & Bookmarking</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Add personal notes, bookmark important sections, and keep a task
                list directly within your documentation workflow.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none bg-transparent">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Brain className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">
                AI-Powered Q&amp;A & Summaries
              </h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Instantly get answers, summaries or code explanations for any
                README or documentation section using integrated AI.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none bg-transparent">
            <CardHeader className="pb-3">
              <CardDecorator>
                <NotebookTabs className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Tabbed & Multi-Doc View</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Open and compare multiple README files or documentation pages
                side by side in separate tabs or panels.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none bg-transparent">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Users className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Collaboration & Sharing</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Share annotated docs, collaborative highlights, or discussion
                threads with your team or the community.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none bg-transparent">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Github className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Direct GitHub Integration</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Deeper integration for issues, pull requests, code references
                and user profiles directly from your GitHub repositories.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none bg-transparent">
            <CardHeader className="pb-3">
              <CardDecorator>
                <FileText className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Import & Export Formats</h3>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-sm">
                Export clean, reader-focused versions of documentation as PDF or
                Markdown, and import your own notes or highlights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
