import { Link, useNavigate } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaSearch, FaHistory } from "react-icons/fa";
import { OrangeButton } from "../common";
import { useEffect, useState } from "react";
import {
  addDataToSearchHistory,
  getSearchHistoryByUserId,
} from "../services/UserService";
import { useStateValue } from "../context/StateProvider";
import { useRef } from "react";
import { all, findById, getData } from "../services/BaseService";
import { MenuItem, FormControl, Select } from "@mui/material";
import { actionType } from "../context/reducer";

const Header = ({ setSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistoryStatus, setShowHistoryStatus] = useState("hidden");
  const [avatarUrl, setAvatarUrl] = useState(undefined)
  const [{ userId }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [users, setUsers] = useState([])

  const search = (e) => {
    e.preventDefault();
    if (searchTerm) {
      addDataToSearchHistory(userId, searchTerm);
      setSearchHistory([searchTerm, ...searchHistory]);
      setShowHistoryStatus("hidden");
      setSearchResult(searchTerm);
    } else {
      navigate("/");
      setSearchResult("");
    }
  };

  useEffect(() => {
    getAllUsers()
    fetchData();
    fetchCurrentUserData();
  }, [userId]);

  const historyRef = useRef(null);

  let searchHistory2 = searchHistory.filter((history) =>
    history.includes(searchTerm)
  );

  const fetchData = async () => {
    const historyList = await getSearchHistoryByUserId(userId);
    setSearchHistory(historyList);
  };

  const fetchCurrentUserData = async () => {
    const user = await findById("users", userId)
    setAvatarUrl(user.avatarUrl)
  }

  const getAllUsers = async () => {
    const usersData = await all('users', 'name');
    const users = await getData(usersData)
    setUsers(users);
  }

  const handleChange = (event) => {
    console.log(event.target.value);
    dispatch({
      type: actionType.SET_USER,
      payload: event.target.value
    })
  }
  
  return (
    <div className="flex justify-between px-4 py-2 h-[10vh] shadow-lg items-center relative z-10">
      <Link
        to="/"
        onClick={() => {
          setSearchResult("");
          setSearchTerm("");
        }}
      >
        <img src="/logo.png" alt="Logo" className="mb-2 md:mb-0" />
      </Link>
      <form className="relative" onSubmit={search}>
        <FaSearch className="absolute top-1/3 left-3" />
        <input
          type="search"
          className="border-solid border-2 rounded-2xl pl-8 py-2 w-96"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onClick={() => {
            if (showHistoryStatus === "hidden") setShowHistoryStatus("");
            else setShowHistoryStatus("hidden");
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></input>

        <ul
          className={`border-solid border-2 absolute w-96 max-h-56 bg-white rounded-xl flex flex-col ${showHistoryStatus}`}
          ref={historyRef}
        >
          {searchHistory2?.slice(0, 5).map((history) => (
            <li
              className="px-4 py-2 hover:bg-gray-200 hover:cursor-pointer"
              key={Math.random()}
              onClick={(e) => {
                setSearchTerm(e.target.innerText);
                setShowHistoryStatus("hidden");
                setSearchResult(e.target.innerText);
              }}
            >
              <FaHistory className="inline mr-2" />
              {history}
            </li>
          ))}
        </ul>
      </form>
      <div className="flex gap-4">
        <OrangeButton
          icon={<IoAddCircleOutline />}
          title={"Thêm bài viết"}
          onClick={() => navigate("/newpost")}
        />
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full w-10 h-14 md:w-14 cursor-pointer"
        />
        <FormControl sx={{ minWidth: 100 }}>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={userId}
          label="Age"
          onChange={handleChange}
        >
          {users.map((user) => (
            <MenuItem value={user.id} key={user.id}>{user.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
    </div>
  );
};

export default Header;
