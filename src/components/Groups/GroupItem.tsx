import { FC, useState } from "react";
import { Group, User } from "./Groups.types";
import style from "./Groups.module.css";

interface IFriendsItems {
  friends: User[];
}

const GroupItem: FC<Group> = (props) => {
  const { avatar_color, name, closed, friends, members_count } = props;

  return (
    <div className={style.group}>
      {avatar_color && (
        <div
          style={{ backgroundColor: avatar_color }}
          className={style.group__avatar}
        />
      )}
      <div className={style.group__name}>{name}</div>
      <div className={style.group__status}>{closed ? "closed" : "open"}</div>
      {!!members_count && (
        <div className={style.group__membres}>Подписчики {members_count}</div>
      )}
      {!!friends && <FriendsItems friends={friends} />}
    </div>
  );
};

const FriendsItems: FC<IFriendsItems> = ({ friends }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen((prev) => !prev);

  return (
    <div>
      <div onClick={handleClick} className={style.group__friends_count}>
        Друзья {friends.length} {open ? "X" : "V"}
      </div>
      {open && (
        <div>
          {friends.map((friend, i) => (
            <div className={style.group__friends_items} key={i}>
              {friend.first_name} {friend.last_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupItem;
