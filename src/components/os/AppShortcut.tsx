import React, { useEffect, useRef } from "react";
import { IconName } from "@/assets/icons";
import Icon from "@/components/common/Icon";

export interface AppShortcutProps {
  icon: IconName;
  isFocused: boolean;
  name: string;
  onOpen: () => void;
  setFocused: () => void;
}

function AppShortcut(props: AppShortcutProps) {
  const nameRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isNameWider, setIsNameWider] = React.useState(false);

  useEffect(() => {
    if (nameRef.current && iconRef.current) {
      setIsNameWider(nameRef.current.clientWidth > iconRef.current.clientWidth);
    }
  }, []);

  return (
    <div
      className={`min-h-[150px] flex flex-col max-w-[120px] items-center justify-center app-shortcut text-retro-dark`}
      onDoubleClick={props.onOpen}
      onClick={props.setFocused}
    >
      <div
        className={`p-2 -mb-2 rounded-t-md ${props.isFocused ? "shortcut-focused" : ""}
                                             ${isNameWider ? "" : "rounded-b-md"}`}
        ref={iconRef}
      >
        <Icon icon={props.icon} size={70} />
      </div>
      <div
        className={`p-2 rounded-b-md ${props.isFocused ? "shortcut-focused" : ""}
                                             ${isNameWider ? "rounded-t-md" : ""}`}
        ref={nameRef}
      >
        <span
          className={
            "px-[7px] py-[2px] max-w-full text-center select-none overflow-hidden whitespace-normal " +
            "text-ellipsis bg-retro-white text-retro-dark font-bold rounded-md border-2 border-retro-dark line-clamp-2"
          }
        >
          {props.name}
        </span>
      </div>
    </div>
  );
}

export default AppShortcut;
