// export const useAuth = () => {
//     const dispatch = useDispatch();
//     const user = useSelector((state) => state); // ❌ returns entire Redux store
//     const [loading, setLoading] = useState(true);
  
//     useEffect(() => {
//       authService.getUser()
//         .then((userFromAppwrite) => {
//           if (userFromAppwrite) {
//             dispatch(logIn(userFromAppwrite.name));
//           } else {
//             dispatch(logOut());
//           }
//         })
//         .finally(() => setLoading(prev => !prev)); // ❌ toggles loading randomly
//     }, []);
  
//     return [user, loading];
//   };
  