import Header from "./Header";
import Container from "../container/Container";
import Card from "./PostCard/Card";
import {useState } from "react";
import { ID } from "appwrite";
import AddPost from "./Add Post/AddPost";
import { useSelector } from "react-redux";

const Home = () => {
  const posts = useSelector((state) => state.Post);
  let [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div id="home">
      <Header isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <Container>
        <AddPost isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <div
          id="feed"
          className="w-full lg:w-[40%] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] bg-amber-70 
           max-h-fit overflow-scroll"
        >
          {posts.map((post) => (
            <Card
              caption={post.caption}
              image={post.imageUrl}
              likes={post.likes}
              comments={post.comments}
              authorName={post.authorName}
              authorUsername={post.authorUserName}
              authorProfileURL={post.authorProfileURL}
              key={ID.unique()}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Home;
