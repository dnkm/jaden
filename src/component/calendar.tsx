import { format, getDaysInMonth, setDate } from "date-fns";
import { SessionsWithTeachername } from "./sessions/component";
import classes from "./calendar.module.scss";

export default function Calendar({
  d,
  onDateClicked = () => {},
  sessionsMap,
}: {
  d: Date;
  onDateClicked?: (date: Date) => void;
  sessionsMap: { [key: number]: SessionsWithTeachername[] };
}) {
  return (
    <div>
      <div className={classes.calendar}>
        {"SUN,MON,TUE,WED,THU,FRI,SAT".split(",").map((v) => (
          <div key={v}>{v}</div>
        ))}
        {new Array(setDate(d, 1).getDay()).fill(undefined).map((_, i) => (
          <div key={i} />
        ))}
        {new Array(getDaysInMonth(d)).fill(undefined).map((_, i) => (
          <Cell
            key={i}
            d={setDate(d, i + 1)}
            sessions={sessionsMap[i + 1] ?? []}
            onDateClicked={(date: Date) => {
              onDateClicked(date);
            }}
            highlighted={d.getDate() == i + 1}
          />
        ))}
        {new Array(7 - ((setDate(d, 1).getDay() + getDaysInMonth(d)) % 7))
          .fill(undefined)
          .map((_, i) => (
            <div key={i} />
          ))}
      </div>
    </div>
  );
}

function Cell({
  d,
  sessions,
  onDateClicked,
  highlighted,
}: {
  d: Date;
  sessions: SessionsWithTeachername[];
  onDateClicked: (date: Date) => void;
  highlighted: boolean;
}) {
  return (
    <div
      className={`hover:bg-base-300 cursor-pointer select-none ${highlighted ? "bg-base-200" : ""}`}
      onClick={() => onDateClicked(d)}
    >
      <span className={`text-sm ${highlighted ? "text-accent" : "text-gray-400"}`}>{d.getDate()}</span>
      <div>
        {sessions.map((v) => (
          <div key={v.session_id} className="badge space-x-1">
            <span className="font-bold">
              {format(new Date(v.datetime), "h:mm")}{" "}
            </span>
            {/* <span>{v.profiles?.full_name}</span> */}
            {/* <span>
              {v.taken}/{v.limit}
            </span> */}
          </div>
        ))}
      </div>
    </div>
  );
}
