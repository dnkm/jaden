import { format, getDaysInMonth, setDate } from "date-fns";
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
    <div>
      <h1 className="text-right">{format(d, "yyyy / MM")}</h1>
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
            onDateClicked={(date:Date) => {
              onDateClicked(date);
              setD(date);
            }}
            highlighted={d.getDate() == i+1}
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
  events,
  onDateClicked,
  highlighted,
}: {
  d: Date;
  events: Date[];
  onDateClicked: (date: Date) => void;
  highlighted: boolean;
}) {
  return (
    <div
      className={`hover:bg-slate-100 cursor-pointer select-none `}
      onClick={() => onDateClicked(d)}
    >
      <span className={highlighted ? "text-accent" : ""}>{d.getDate()}</span>
    </div>
  );
}
