import { Time } from "@vidstack/react";

export function CurrentTime() {
  return <Time className="time text-default-400 text-xs" type="current" />;
}

export function Duration() {
  return <Time className="time text-default-400 text-xs" type="duration" />;
}
