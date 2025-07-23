import { useEffect, useState } from "react";
import { ImageUp, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import storageServices from "../../../services/Storage";
import postServices from "../../../services/Post";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../../../store/refresh/refreshSlice";
import { motion } from "motion/react";
import {BlinkBlur} from 'react-loading-indicators'
const AddPost = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  let [inputMedia, setInputMedia] = useState("");
  let [caption, setCaption] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.auth.userData.userId);
  const status = useSelector((state) => state.auth.userStatus);
  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputMedia(file);
      document.getElementById(
        "preview"
      ).style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    }
  };

  const addPost = () => {
    if (!status || !inputMedia || !caption || !userId) {
      toast.error("Upload the picture with caption",{
        autoClose:3000
      });
      return;
    }
    setIsLoading((prev) => !prev);
    storageServices
      .uploadFile(inputMedia)
      .then((file) => {
        const imageUrl = storageServices.getFileView(file.$id);
        postServices
          .addPost({
            caption,
            imageUrl,
            userId,
            status,
          })
          .then(() => {
            setIsLoading((prev) => !prev);
            toast.success("Post Uploaded");
            setCaption("");
            setInputMedia("");
            setIsModalOpen((prev) => !prev);
            dispatch(refresh());
            document.getElementById(
              "preview"
            ).style.background = 'none';
          })
          .catch((err) => toast.error(err,{autoClose:3000}));
      })
      .catch((err) => toast.error(err,{autoClose:3000}));
  };

  useEffect(() => {
    if (isModalOpen)
      document.getElementById("feed").classList.add("overflow-hidden");
    else document.getElementById("feed").classList.remove("overflow-hidden");
  }, [isModalOpen]);
  return (
    <div
      className={`${
        isModalOpen
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      } transition ease-in-out duration-300 fixed top-0 left-0 bottom-0 backdrop-blur-md  bg-gradient-to-br from-[var(--brand-color)] to-black py-20 px-5  box-border gap-5 h-screen overflow-scroll z-50 flex flex-col justify-start   items-center     w-full`}
    >
      <div
        id="addPostLoading"
        className={`${
          isLoading ? "" : "hidden"
        } absolute top-0 left-0 h-full w-full z-10 bg-black/30 backdrop-blur-sm flex justify-center items-center`}
      >
        {/* <motion.div
          className="h-20 w-20 lg:w-40 lg:h-40 border-2 border-dashed  border-white rounded-[50%]"
          initial={{ rotate: 0}}
          animate={{ rotate: 360}}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: 'linear',
            type:'tween',
          }}
        ></motion.div> */}
        <BlinkBlur color={["#000000", "#082828", "#115252", "#1a7c7c"]} text='Showcasing your picture to the world' textColor="white" />
      </div>
      <button
        onClick={(e) => setIsModalOpen((prev) => !prev)}
        id="close-modal"
        className="absolute right-5 top-5 cursor-pointer z-10 "
      >
        <X className={`${isLoading ? "hidden" : ""}`} />
      </button>
      <input
        className=" hidden rounded-2xl bg-amber-500"
        id="inputFile"
        type="file"
        accept="image/*"
        onChange={handleMedia}
      />
      <div
        id="preview"
        onClick={() => document.getElementById("inputFile").click()}
        className={`bg-cover bg-center bg-[var(--brand-color)]/20 h-60 w-72 lg:h-96 lg:w-[30%] rounded-lg cursor-pointer overflow-hidden flex justify-center items-center p-0 right-0  relative `}
      >
        {inputMedia ? "" : <ImagePlus className={`h-10 w-10 text-white`} />}
      </div>
      <textarea
        className={`resize-none text-white h-16 w-full lg:h-24 lg:w-80 focus:outline-0 p-3 rounded-lg  `}
        id=""
        cols="30"
        rows="10"
        placeholder="Something about that moment"
        readOnly={!inputMedia}
        onClick={() => {
          if (!inputMedia) toast.warn("Please upload an image first.");
        }}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      ></textarea>
      <button
        onClick={addPost}
        className={`${
          caption ? "opacity-100" : "opacity-10"
        } btn bg-gradient-to-bl from-[var(--brand-color)] to-black/50 w-60 border active:border-white hover:border-white border-white/10`}
      >
        Post
      </button>
    </div>
  );
};

export default AddPost;
