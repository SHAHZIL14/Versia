import Header from "./Header";
import Container from "../container/Container";
import { useState } from "react";
import Feed from "../Feed/Feed";

const Home = () => {
  let [isOptionOpen, setIsOptionOpen] = useState(false);
  return (
    <div id="home" className="min-h-screen ">
      <Header options={{ isOptionOpen, setIsOptionOpen }} />
      <Container>
        <Feed/>
      </Container>
    </div>
  );
};

export default Home;
