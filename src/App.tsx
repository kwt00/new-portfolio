import CustomCursor from "./components/reactbits/CustomCursor";
import ScrollMosaic from "./components/ScrollMosaic";
import Hero from "./sections/Hero";
import Marquee from "./components/Marquee";
import Research from "./sections/Research";
import NgramResearch from "./sections/NgramResearch";
import Experience from "./sections/Experience";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <CustomCursor />
      <main>
        <Hero />
        <Marquee />
        <ScrollMosaic className="my-0 mt-40" />
        <Experience />
        <ScrollMosaic className="my-0" />
        <Research />
        <ScrollMosaic className="my-0" />
        <NgramResearch />
      </main>
      <Footer />
    </>
  );
}

export default App;
