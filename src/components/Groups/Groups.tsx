import style from "./Groups.module.css";
import data from "../../data/data.json";
import { ChangeEvent, useEffect, useState } from "react";
import { GetGroupsResponse, Group } from "./Groups.types";
import GroupItem from "./GroupItem";

const mockFetch = () => {
  return new Promise<GetGroupsResponse>((res) => {
    const responceData: GetGroupsResponse = {
      result: 1,
      data,
    };
    setTimeout(() => res(responceData), 1000);
  });
};

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [privateSelect, setPrivateSelect] = useState<"close" | "open" | "all">(
    "all"
  );
  const [friendSelect, setFriendSelect] = useState<"all" | "have" | "no">(
    "all"
  );
  const [colorSelect, setColorSelect] = useState<string>("all");

  const filterGroups = (groups: Group[]): Group[] => {
    return groups.filter((group) => {
      if (privateSelect === "close") {
        if (!group.closed) return false;
      }
      if (privateSelect === "open") {
        if (group.closed) return false;
      }
      if (friendSelect === "have") {
        if (!group.friends) return false;
      }
      if (friendSelect === "no") {
        if (group.friends) return false;
      }
      if (colorSelect !== "all") {
        if (group.avatar_color !== colorSelect) return false;
      }
      return true;
    });
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { result, data } = await mockFetch();
        if (result === 0) {
          throw new Error("server error");
        }
        if (!data) {
          throw new Error("not data");
        }
        setGroups(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("some error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!groups || isLoading) {
    return <div>loading...</div>;
  }

  const colorOptions = [
    ...groups.reduce<Set<string>>((set, group) => {
      if (group.avatar_color) set.add(group.avatar_color);
      return set;
    }, new Set<string>()),
  ];

  return (
    <div className={style.wrapper}>
      <h1 className={style.title}>Группы</h1>
      <div className={style.filter}>
        <label className={style.filter__item}>
          Private
          <select
            value={privateSelect}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const value = event.target.value as "all" | "close" | "open";
              setPrivateSelect(value);
            }}
          >
            <option value="all">all</option>
            <option value="close">closed</option>
            <option value="open">opened</option>
          </select>
        </label>
        <label className={style.filter__item}>
          Friends
          <select
            value={friendSelect}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const value = event.target.value as "all" | "have" | "no";
              setFriendSelect(value);
            }}
          >
            <option value="all">all</option>
            <option value="have">have</option>
            <option value="no">no</option>
          </select>
        </label>
        <label className={style.filter__item}>
          Colors
          <select
            value={colorSelect}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const value = event.target.value;
              setColorSelect(value);
            }}
          >
            <option value="all">all</option>
            {colorOptions.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={style.container}>
        {filterGroups(groups).map((group) => (
          <GroupItem key={group.id} {...group} />
        ))}
      </div>
    </div>
  );
};

export default Groups;
