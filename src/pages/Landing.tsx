import { AnimatedGroup } from "@/components/ui/animated-group"
import { HeroHeader } from "@/components/landing/Header"
import HeroSection from "@/components/landing/HeroSection"
import Features from "@/components/landing/FeaturesRoadmap"
import Contributors from "@/components/landing/Contributors"
import WaitList from "@/components/landing/WaitList"
import { DotsBackground } from "@/components/landing/Background"

const heroShowcaseContainerVariants = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } },
}

const animateVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 12,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring" as const,
      bounce: 0.3,
      duration: 1.5,
    },
  },
}

export default function Landing() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroHeader />
      <DotsBackground />
      <AnimatedGroup
        variants={{
          container: heroShowcaseContainerVariants,
          item: animateVariants,
        }}
      >
        <HeroSection />
        <Features />
        <Contributors />
        <WaitList />
      </AnimatedGroup>
    </main>
  )
}
