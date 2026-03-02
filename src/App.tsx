import ClickSpark from "./components/reactbits/ClickSpark";
import CustomCursor from "./components/reactbits/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import InteractiveBlocks from "./components/InteractiveBlocks";
import ScrollMosaic from "./components/ScrollMosaic";
import Hero from "./sections/Hero";
import Marquee from "./components/Marquee";
import About from "./sections/About";
import Research from "./sections/Research";
import Experience from "./sections/Experience";
import Footer from "./components/Footer";

function App() {
  return (
    <ClickSpark sparkColor="#e85d75" sparkCount={10} sparkSize={6}>
      <CustomCursor color="#1a1613" size={8} trailSize={28} />
      <ScrollProgress />
      <main>
        <Hero />
        <Marquee />
        <ScrollMosaic className="my-0" />
        {/* Floating grotesque blocks behind About */}
        <div className="relative">
          <InteractiveBlocks className="absolute inset-0 h-full" />
          <About />
        </div>
        <ScrollMosaic className="my-0" />
        <Research />
        <ScrollMosaic className="my-0" />
        <Experience />
      </main>
      <Footer />
    </ClickSpark>
  );
}

export default App;
