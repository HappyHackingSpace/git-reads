import HeroSection from "@/components/landing-page/hero-section";
import Features from "@/components/landing-page/features-roadmap";
import WaitList from "@/components/landing-page/waitlist";
import { DotsBackground } from "@/components/landing-page/background";

export default function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <DotsBackground />
      <HeroSection />
      <Features />
      <WaitList />
    </main>
  );
}
