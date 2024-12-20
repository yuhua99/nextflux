import { TimeSlider } from "@vidstack/react";
import {
  CurrentTime,
  Duration,
} from "@/components/ArticleView/components/shared/time-group.jsx";

export function Time() {
  return (
    <div className="w-full">
      <TimeSlider.Root className="group relative inline-flex w-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
        <TimeSlider.Track className="relative ring-sky-400 z-0 h-[5px] w-full rounded-full bg-content2/30 group-data-[focus]:ring-[3px]">
          <TimeSlider.TrackFill className="bg-primary absolute h-full w-[var(--slider-fill)] rounded-full will-change-[width]" />
          <TimeSlider.Progress className="absolute z-10 h-full w-[var(--slider-progress)] rounded-full bg-content2/50 will-change-[width]" />
        </TimeSlider.Track>
        <TimeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-custom bg-white  ring-primary/40 group-data-[dragging]:ring-4 will-change-[left]" />
      </TimeSlider.Root>
      <div className="flex justify-between">
        <CurrentTime />
        <Duration />
      </div>
    </div>
  );
}
