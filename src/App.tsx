import CustomCursor from "./components/reactbits/CustomCursor";
import Hero from "./sections/Hero";
import WritingIndex from "./sections/WritingIndex";
import Experience from "./sections/Experience";
import Footer from "./components/Footer";
import TranscoderArticle from "./pages/TranscoderArticle";
import DirectionalRoutingPage from "./pages/DirectionalRoutingPage";
import NgramPage from "./pages/NgramPage";
import { usePath } from "./lib/router";

function Home() {
  return (
    <main>
      <Hero />
      <WritingIndex />
      <Experience />
    </main>
  );
}

function App() {
  const path = usePath().replace(/\/$/, "");
  let page;
  if (path === "/transcoders") page = <TranscoderArticle />;
  else if (path === "/directional-routing") page = <DirectionalRoutingPage />;
  else if (path === "/ngram-contracts") page = <NgramPage />;
  else page = <Home />;

  return (
    <>
      <CustomCursor />
      {page}
      <Footer />
    </>
  );
}

export default App;
