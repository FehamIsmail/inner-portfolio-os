import React, { useEffect, useRef } from "react";
import { IconName } from "@/assets/icons";
import Icon from "@/components/common/Icon";

export interface AppShortcutProps {
  icon: IconName;
  isFocused: boolean;
  name: string;
  onOpen: () => void;
  setFocused: () => void;
  isMobile: boolean;
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
      className={`flex flex-col items-center justify-center app-shortcut text-retro-dark ${
        props.isMobile
          ? "min-h-[96px] max-w-[76px]"
          : "min-h-[150px] max-w-[120px]"
      }`}
      onDoubleClick={props.isMobile ? undefined : props.onOpen}
      onClick={props.isMobile ? props.onOpen : props.setFocused}
    >
      <div
        className={`rounded-md ${props.isFocused ? "shortcut-focused" : ""}`}
      >
        <div className={`p-2 -mb-2`} ref={iconRef}>
          <Icon icon={props.icon} size={props.isMobile ? 40 : 70} />
        </div>
        <div className="p-2" ref={nameRef}>
          <span
            className={`px-[7px] py-[2px] max-w-full text-center select-none overflow-hidden whitespace-normal
                     text-ellipsis bg-retro-white text-retro-dark font-bold rounded-md border-2 border-retro-dark line-clamp-2 ${
                       props.isMobile ? "text-xs" : ""
                     }`}
          >
            {props.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AppShortcut;
