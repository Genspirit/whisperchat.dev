import useStyles from "./styles";

export default function ChatMessage({ type, content, name }) {
  const classes = useStyles();

  const scrollIntoView = (element: HTMLElement) =>
    element && element.scrollIntoView({ behavior: "smooth" });

  return (
    <div ref={scrollIntoView} className={classes[type]}>
      <h5>{name}</h5>
      <span>{content}</span>
    </div>
  );
}
