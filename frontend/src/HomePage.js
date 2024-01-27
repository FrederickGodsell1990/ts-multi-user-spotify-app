import FavouriteArtistSearch from "./FavouriteArtistSearch.js";
import { NavBar } from "./navBar";
import { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { ReleaseRaderAPICallFunction } from "./components/ReleaseRadarComponent.js";
import { fetchReleaseRadarData } from "./redux/slices/releaseRadarSlice";
import { RadarCodeFromMongoSliceThunk } from "./redux/thunks";

export const Homepage = () => {
  const dispatch = useDispatch();

  const mongoDBThunkValueFromStore = useSelector((store) => store.mongoDBThunk);
  console.log("mongoDBThunkValueFromStore", mongoDBThunkValueFromStore);

  useEffect(() => {
    (async () => {
      dispatch(RadarCodeFromMongoSliceThunk());
    })();
  }, []);

  return (
    <>
      <NavBar />
      <FavouriteArtistSearch />
      <ReleaseRaderAPICallFunction />
      <h5> Release Radar Code {mongoDBThunkValueFromStore.mongoCode} </h5>

      <button
        onClick={() =>
          dispatch(fetchReleaseRadarData("37i9dQZEVXbpTERBYDw7WM"))
        }
      >
        Click for createslice
      </button>
    </>
  );
};
