import useStyles from "./styles";

import StatusIcon from "./statusIcon";
import NameTag from "./nameTag";

export default function ChatHeader({ status, name, roomId, setName }) {
  const classes = useStyles();
  return (
    <div className={classes.chatHeader}>
      <h1>{roomId}</h1>
      <div>
        <StatusIcon status={status} />
        <NameTag setName={setName} name={name} />
      </div>
    </div>
  );
}
