import { format, getDaysInMonth, setDate } from "date-fns";
import { useContext } from "react";
import { AppContext } from "../App";
import classes from "./calendar.module.scss";
import { SessionWithTeachername } from "./sessions/component";
import { Tables } from "../../types/supabase";

export default function Calendar({
  d,
  onDateClicked = () => {},
  sessionsMap,
}: {
  d: Date;
  onDateClicked?: (date: Date) => void;
  sessionsMap: { [key: number]: SessionWithTeachername[] };
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
  sessions: SessionWithTeachername[];
  onDateClicked: (date: Date) => void;
  highlighted: boolean;
}) {
  const { role } = useContext(AppContext);

  return (
    <div
      className={`hover:bg-base-200 cursor-pointer select-none ${
        highlighted ? "bg-neutral" : ""
      }`}
      onClick={() => onDateClicked(d)}
    >
      <span
        className={`text-sm ${highlighted ? "text-accent" : "text-gray-400"}`}
      >
        {d.getDate()}
      </span>
      <div>
        {sessions.map((v) => (
          <div
            key={v.session_id}
            className={`space-x-1 text-sm py-0.5 px-1 rounded-lg overflow-hidden ${
              !!v.enroll.find(
                (e: Partial<Tables<"enroll">>) => e.student_id === role?.id
              )
                ? "bg-primary text-primary-content"
                : "bg-secondary text-secondary-content"
            }`}
          >
            <div>
              <div className="font-bold">
                {format(new Date(v.datetime), "h:mm")}{" "}
                {/* {role?.is_teacher && <>({v.enroll.length})</>} */}
              </div>
              {v.name && <div>{v.name}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
