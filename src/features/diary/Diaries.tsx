import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import http from "../../services/api";
import { Diary } from "../../interfaces/diary.interface";
import { addDiary } from "./diariesSlice";
// import Swal from "sweetalert2";
import { setUser } from "../auth/userSlice";
import DiaryTile from "./DiaryTile";
import { User } from "../../interfaces/user.interface";
import { Routes, Route } from "react-router-dom";
import DiaryEntriesList from "./DiaryEntriesList";
import { useAppDispatch } from "../../store";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Diaries = () => {
  const dispatch = useAppDispatch();
  const diaries = useSelector((state: RootState) => state.diaries);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        http.get<null, Diary[]>(`diaries/${user.id}`).then((data) => {
          if (data && data.length > 0) {
            const sortedByUpdatedAt = data.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(addDiary(sortedByUpdatedAt));
          }
        });
      }
    };

    fetchDiaries();
  }, [dispatch, user]);

  const createDiary = async () => {
    const result = await Swal.mixin({
      input: "text",
      confirmButtonText: "Next →",
      showCancelButton: true,
      progressSteps: ["1", "2"],
    }).queue([
      {
        titleText: "Diary title",
        input: "text",
      },
      {
        titleText: "Private or public diary?",
        input: "radio",
        inputOptions: {
          private: "Private",
          public: "Public",
        },
        inputValue: "private",
      },
    ]);
  };

  return (
    <div>
      <Routes>
        <Route path="/">
          <button onClick={createDiary}>Create New</button>
          {}
        </Route>
        <Route path="/diary/:id">
          <DiaryEntriesList />
        </Route>
      </Routes>
    </div>
  );
};

export default Diaries;
