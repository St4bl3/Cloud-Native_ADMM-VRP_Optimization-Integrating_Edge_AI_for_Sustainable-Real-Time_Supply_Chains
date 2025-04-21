import { GlobeDemo } from "@/components/Globe";
import { BackgroundHome } from "@/components/Home";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <div>
      <div className="w-full h-screen overflow-auto">
        <BackgroundBeams />

        {/* Section 1: Background Home */}
        <section className="h-screen flex items-center justify-center bg-transparent ">
          <BackgroundHome />
        </section>

        {/* Section 2: Placeholder for Content */}
        <section className="h-screen flex items-center justify-center ">
          <GlobeDemo />
        </section>
      </div>
    </div>
  );
}
