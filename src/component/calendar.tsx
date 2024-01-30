import { getDaysInMonth, setDate } from "date-fns";
import { useState } from "react";
import classes from "./calendar.module.scss";

export default function Calendar({
  events = [],
  onDateClicked = () => {},
}: {
  events?: Date[];
  onDateClicked?: (date: Date) => void;
}) {
  let [d, setD] = useState<Date>(new Date());
  return (
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
          events={events}
          onDateClicked={onDateClicked}
        />
      ))}
      {new Array(7 - ((setDate(d, 1).getDay() + getDaysInMonth(d)) % 7))
        .fill(undefined)
        .map((_, i) => (
          <div key={i} />
        ))}
    </div>
  );
}

function Cell({
  d,
  events,
  onDateClicked,
}: {
  d: Date;
  events: Date[];
  onDateClicked: (date: Date) => void;
}) {
  return (
    <div
      className="hover:bg-slate-100 cursor-pointer select-none"
      onClick={() => onDateClicked(d)}
    >
      {d.getDate()}
    </div>
  );
}
