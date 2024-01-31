import { format } from "date-fns";
import { useState } from "react";
import { Tables } from "../../../types/supabase";
import SessionForm from "./session-form";

export default function DateView({
  selectedDate,
  setSessions,
}: {
  selectedDate: Date;
  setSessions: Function;
}) {
  let [formEntry, setFormEntry] = useState<Tables<"sessions"> | undefined>(
    undefined
  );

  return (
    <div className="border rounded p-5 my-5 space-y-5">
      <div className="flex justify-between">
        <h3>{format(selectedDate, "MM/dd EEE")}</h3>
        <div>
          <button
            className="btn btn-primary"
            onClick={() =>
              (
                document.getElementById(
                  "teacher_session_form_modal"
                ) as HTMLDialogElement
              ).showModal()
            }
          >
            Add Session
          </button>
        </div>
      </div>

      {/* form */}
      <SessionForm setSessions={setSessions} selectedDate={selectedDate} />
    </div>
  );
}
