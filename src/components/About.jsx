import Container from "../container/Container";
import Header from "./Header";

const About = () => {
  return (
    <Container>
      <Header />
      <div
        id="feed"
        className="w-[80%] bg-amber-700  border-2 border-black h-fit max-h-screen overflow-scroll"
      >

      </div>
    </Container>
  );
};

export default About;
