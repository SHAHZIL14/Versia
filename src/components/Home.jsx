import Header from "./Header";
import Container from "../container/Container";
import Card from "./PostCard/Card";
import storageServices from "../../services/Storage";
import { useEffect, useState } from "react";
import { ID } from "appwrite";
import AddPost from "./Add Post/AddPost";
import postServices from "../../services/Post";
import { useDispatch, useSelector } from "react-redux";
import { addBatch } from "../../store/Post/PostSlice";
const Home = () => {
  const posts = useSelector((state) => state.Post);
  let [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div id="home">
      <Header setIsModalOpen={setIsModalOpen} />
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
