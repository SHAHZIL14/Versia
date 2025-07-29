import { useEffect, useState } from "react";
import { ImageUp, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import storageServices from "../../../services/Storage";
import postServices from "../../../services/Post";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../../../store/refresh/refreshSlice";
import { changeIsFetched } from "../../../store/Post/PostSlice";
import { BlinkBlur } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
const AddPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [inputMedia, setInputMedia] = useState("");
  let [caption, setCaption] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.auth.userData.userId);
  const status = useSelector((state) => state.auth.userStatus);
  const authorName = useSelector((state) => state.auth.userData.name);
  const authorUserName = useSelector((state) => state.auth.userData.userName);
  const authorProfileURL = useSelector(
    (state) => state.auth.userData.profileSource
  );
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
    if (!status || !userId) {
      toast.error("Something went wrong, please login again.", {
        autoClose: 4000,
      });
      return;
    }

    if (!inputMedia) {
      toast.error("Please upload the picture.", {
        autoClose: 4000,
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
            status,
            userId,
            authorName,
            authorUserName,
            authorProfileURL,
          })
          .then(() => {
            setIsLoading((prev) => !prev);
            setCaption("");
            setInputMedia("");
            toast.success("Post Uploaded");
            document.getElementById("preview").style.background = "none";
            dispatch(changeIsFetched(false));
            navigate(-1);
          })
          .catch((err) => toast.error(err, { autoClose: 4000 }));
      })
      .catch((err) => toast.error(err, { autoClose: 4000 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`transition ease-in-out duration-300 fixed top-0 left-0 bottom-0 backdrop-blur-md  bg-gradient-to-br from-[var(--brand-color)] to-slate-800 py-20 px-5  box-border gap-5 h-screen overflow-scroll z-50 flex flex-col justify-start   items-center     w-full`}
    >
      <div
        id="addPostLoading"
        className={`${
          isLoading ? "" : "hidden"
        } absolute top-0 left-0 h-full w-full z-10 bg-black/30 backdrop-blur-sm flex justify-center items-center`}
      >
        <BlinkBlur
          color={["#000000", "#082828", "#115252", "#1a7c7c"]}
          text="Showcasing your picture to the world"
          textColor="white"
        />
      </div>
      <button
        onClick={(e) => {
          navigate(-1);
          setInputMedia("");
          setCaption("");
          document.getElementById("preview").style.background = "none";
        }}
        id="close-modal"
        className="absolute right-5 top-5 cursor-pointer z-10 "
      >
        <X className={`${isLoading ? "hidden" : ""}`} />
      </button>
      <input
        className=" hidden rounded-2xl "
        id="inputFile"
        type="file"
        accept="image/*"
        onChange={handleMedia}
      />
      <div
        id="preview"
        onClick={() => document.getElementById("inputFile").click()}
        className={` bg-cover bg-center bg-[var(--brand-color)]/20 h-60 w-72 lg:h-96 lg:w-[30%] rounded-lg cursor-pointer overflow-hidden flex justify-center items-center p-0 right-0  relative `}
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
          inputMedia ? "opacity-100" : "opacity-10"
        } btn bg-gradient-to-bl from-[var(--brand-color)] to-black/30 w-60 border active:border-white hover:border-white border-white/10`}
      >
        Post
      </button>
    </motion.div>
  );
};

export default AddPost;
