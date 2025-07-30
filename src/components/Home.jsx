import Header from "./Header";
import Container from "../container/Container";
import { useState } from "react";
import Feed from "../Feed/Feed";

const Home = () => {
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [isOptionOpen, setIsOptionOpen] = useState(false);
  return (
    <div id="home" className="min-h-screen ">
      <Header
        options={{ isOptionOpen, setIsOptionOpen }}
        setIsModalOpen={setIsModalOpen}
      />
      <Container>
        <Feed/>
      </Container>
    </div>
  );
};

export default Home;
