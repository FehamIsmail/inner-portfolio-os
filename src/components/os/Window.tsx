"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Icon from "@/components/common/Icon";
import { ApplicationType } from "@/constants/types";
import { motion, useSpring } from "framer-motion";
import { WindowAnimationState } from "@/constants/enums";
import {
  getOpacity,
  getScaleByAnimationState,
} from "@/components/utils/AnimationUtils";
import useResizeObserver from "@react-hook/resize-observer";
import { usePathname } from "next/navigation";

const SPRING_OPTIONS = { damping: 54, stiffness: 3000 };
const MIN_WIDTH = 420;
const MIN_HEIGHT = 180;
const TITLE_BAR_HEIGHT = { value: 24, className: "max-h-[24px]" };
const STATUS_BAR_HEIGHT = { value: 20, className: "min-h-[20px]" };

const scrollBarClassNames =
  "scrollbar scrollbar-thumb-retro-dark scrollbar-track-transparent scrollbar-corner-retro-dark scrollbar-track-rounded-none";

const titleBarColors = {
  red: "bg-retro-red",
  green: "bg-retro-green",
  blue: "bg-retro-blue",
  yellow: "bg-retro-yellow",
};
const titleBarHeight = {
  value: 24,
  className: "max-h-[24px]",
};

const statusBarHeight = {
  value: 20,
  className: "min-h-[20px]",
};

interface WindowDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WindowProps {
  top: number;
  left: number;
  onClose: () => void;
  onMinimize?: () => void;
  onInteract: () => void;
  animationState: WindowAnimationState;
  setAnimationState: (state: WindowAnimationState) => void;
  application: ApplicationType;
  taskbarPos: number;
  isModal?: boolean;
}

function Window(props: WindowProps) {
  const {
    animationState,
    setAnimationState,
    application,
    taskbarPos,
    onInteract,
    onClose,
    onMinimize,
    isModal,
    top,
    left,
  } = props;

  const dragCoords = useRef({ dragStartX: 0, dragStartY: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const initialDimensions = useMemo(
    () => ({
      x: left,
      y: top,
      width: application.width || MIN_WIDTH,
      height: application.height || MIN_HEIGHT,
    }),
    [left, top, application.width, application.height],
  );

  const [firstRender, setFirstRender] = React.useState(true);
  const [sizeInitialized, setSizeInitialized] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [currentWindowDimensions, setCurrentWindowDimensions] =
    React.useState(initialDimensions);
  const [prevWindowDimensions, setPrevWindowDimensions] =
    React.useState(initialDimensions);

  const rafRef = useRef<number>();

  const navigation = usePathname();

  const windowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollBarBorderRef = useRef<HTMLDivElement>(null);

  const titleBarColor = titleBarColors[props.application.titleBarColor];

  const motionX = useSpring(currentWindowDimensions.x, SPRING_OPTIONS);
  const motionY = useSpring(currentWindowDimensions.y, SPRING_OPTIONS);
  const motionWidth = useSpring(currentWindowDimensions.width, SPRING_OPTIONS);
  const motionHeight = useSpring(
    currentWindowDimensions.height,
    SPRING_OPTIONS,
  );
  const motionScale = useSpring(0.6, SPRING_OPTIONS);

  useResizeObserver(containerRef, () => {
    checkOverflow();
  });

  const setMotionValues = useCallback(
    (values: WindowDimensions) => {
      if (
        (animationState === WindowAnimationState.DRAGGING ||
          animationState === WindowAnimationState.RESIZING) &&
        !isMaximized
      ) {
        motionX.jump(values.x, true);
        motionY.jump(values.y, true);
        motionWidth.jump(values.width || MIN_WIDTH, true);
        motionHeight.jump(values.height || MIN_HEIGHT, true);
      } else {
        motionX.set(values.x);
        motionY.set(values.y);
        motionWidth.set(values.width || MIN_WIDTH);
        motionHeight.set(values.height || MIN_HEIGHT);
      }
    },
    [motionX, motionY, motionWidth, motionHeight, animationState, isMaximized],
  );

  const checkOverflow = useCallback(() => {
    if (props.application.resizable === false) return;
    const cont = containerRef.current;
    const scrollBarBorder = scrollBarBorderRef.current;
    if (cont && animationState !== WindowAnimationState.MINIMIZING) {
      setIsOverflowing(cont.scrollHeight > cont.clientHeight);
      if (scrollBarBorder) {
        scrollBarBorder.style.height = `${cont.clientHeight}px`;
      }
    }
  }, [containerRef, scrollBarBorderRef, animationState]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setAnimationState(WindowAnimationState.RESIZING);
    window.addEventListener("mousemove", onResize, false);
    window.addEventListener("mouseup", stopResize, false);
  };

  const onResize = ({ clientX, clientY }: MouseEvent) => {
    const currentWidth = clientX - currentWindowDimensions.x;
    const currentHeight = clientY - currentWindowDimensions.y;
    if (currentWidth >= MIN_WIDTH) currentWindowDimensions.width = currentWidth;
    if (currentHeight >= MIN_HEIGHT)
      currentWindowDimensions.height = currentHeight;
    setCurrentWindowDimensions({ ...currentWindowDimensions });
  };

  const stopResize = () => {
    setPrevWindowDimensions(currentWindowDimensions);
    setAnimationState(WindowAnimationState.VISIBLE);
    window.removeEventListener("mousemove", onResize, false);
    window.removeEventListener("mouseup", stopResize, false);
  };

  const getOffsetX = () => {
    let offsetX = 0;
    if (isMaximized) {
      const startX = dragCoords.current?.dragStartX;
      const prevWidth = prevWindowDimensions.width;
      if (
        startX >= prevWidth / 2 &&
        startX <= window.innerWidth - prevWidth / 2
      )
        offsetX = startX - prevWidth / 2;
      else if (startX >= window.innerWidth - prevWidth / 2)
        offsetX = window.innerWidth - prevWidth;
    }
    return offsetX;
  };

  const getRealCoords = (
    clientX: number,
    clientY: number,
  ): { x: number; y: number } => {
    if (!dragCoords.current) return { x: 0, y: 0 };
    const { dragStartX, dragStartY } = dragCoords.current;
    return {
      x: clientX - dragStartX + currentWindowDimensions.x,
      y: clientY - dragStartY + currentWindowDimensions.y,
    };
  };

  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onInteract();

      const { clientX, clientY } = e;
      dragCoords.current = {
        dragStartX: clientX,
        dragStartY: clientY,
      };
      isDragging.current = true;
      lastMousePos.current = { x: clientX, y: clientY };

      setAnimationState(WindowAnimationState.DRAGGING);
      window.addEventListener("mousemove", onDrag, { passive: true });
      window.addEventListener("mouseup", stopDrag);
    },
    [onInteract, setAnimationState],
  );

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      // Cancel existing RAF before scheduling new one
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use RAF for smooth animation
      rafRef.current = requestAnimationFrame(() => {
        if (!(e.buttons & 1)) {
          stopDrag(e);
          return;
        }

        const { clientX, clientY } = e;
        // Skip if mouse hasn't moved enough to warrant update
        if (
          Math.abs(clientX - lastMousePos.current.x) < 1 &&
          Math.abs(clientY - lastMousePos.current.y) < 1
        ) {
          return;
        }

        lastMousePos.current = { x: clientX, y: clientY };
        const { x, y } = getRealCoords(clientX, clientY);

        const { width, height } = isMaximized
          ? prevWindowDimensions
          : currentWindowDimensions;

        const isGettingMaximized =
          application.resizable === false ? false : y < 0;

        setCurrentWindowDimensions((prev) => ({
          x: isGettingMaximized ? 0 : x + getOffsetX(),
          y: isGettingMaximized ? 0 : y,
          width: isGettingMaximized ? window.innerWidth : width,
          height: isGettingMaximized ? window.innerHeight - 40 : height,
        }));

        setIsMaximized(isGettingMaximized);
      });
    },
    [
      isMaximized,
      prevWindowDimensions,
      currentWindowDimensions,
      application.resizable,
    ],
  );

  const maximizeWindow = useCallback(
    (actionOrigin: "DRAG" | "BUTTON") => {
      if (props.application.resizable === false) return;
      setIsMaximized(true);
      if (actionOrigin === "BUTTON")
        setPrevWindowDimensions(currentWindowDimensions);
      setCurrentWindowDimensions({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 40,
      });
    },
    [currentWindowDimensions, props.application.resizable],
  );

  const maximizeHandler = () => {
    if (isMaximized) {
      setCurrentWindowDimensions(prevWindowDimensions);
      setIsMaximized(false);
    } else {
      maximizeWindow("BUTTON");
    }
  };

  const stopDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (!windowRef.current) return;
      let { x, y } = getRealCoords(e.clientX, e.clientY);
      // Get Window dimensions
      const { width } = windowRef.current.getBoundingClientRect();
      // Add boundary checks
      if (x + getOffsetX() < -width + 145) x = -width + 145 - getOffsetX();
      if (y < 0 && props.application.resizable !== false) {
        maximizeWindow("DRAG");
        window.removeEventListener("mousemove", onDrag, false);
        window.removeEventListener("mouseup", stopDrag, false);
        setAnimationState(WindowAnimationState.VISIBLE);
        return;
      }
      if (x > window.innerWidth - 102) x = window.innerWidth - 102;
      if (y > window.innerHeight - 100) y = window.innerHeight - 100;
      if (y < 0) y = 0;
      const { width: finalWidth, height: finalHeight } = isMaximized
        ? prevWindowDimensions
        : currentWindowDimensions;
      setCurrentWindowDimensions({
        x: x + getOffsetX(),
        y,
        width: finalWidth,
        height: finalHeight,
      });
      setPrevWindowDimensions({
        ...prevWindowDimensions,
        x: x + getOffsetX(),
        y,
      });
      setAnimationState(WindowAnimationState.VISIBLE);
      window.removeEventListener("mousemove", onDrag, false);
      window.removeEventListener("mouseup", stopDrag, false);
    },
    [
      currentWindowDimensions,
      getOffsetX,
      getRealCoords,
      isMaximized,
      maximizeWindow,
      onDrag,
      prevWindowDimensions,
      props.application.resizable,
      setAnimationState,
    ],
  );

  const animateMinimize = () => {
    setCurrentWindowDimensions({
      ...currentWindowDimensions,
      x: props.taskbarPos - currentWindowDimensions.width / 2,
      y: window.innerHeight - 140,
    });
  };

  const revertWindow = () => {
    setCurrentWindowDimensions(prevWindowDimensions);
  };

  const repositionWindow = () => {
    setCurrentWindowDimensions({
      ...currentWindowDimensions,
      x: (currentWindowDimensions.x + prevWindowDimensions.x) / 2,
      y: (currentWindowDimensions.y + prevWindowDimensions.y) / 2,
    });
  };

  useEffect(() => {
    switch (animationState) {
      case WindowAnimationState.OPENING:
        setCurrentWindowDimensions(prevWindowDimensions);
        break;
      case WindowAnimationState.RESTORING:
        if (isMaximized) maximizeWindow("BUTTON");
        else revertWindow();
        break;
      case WindowAnimationState.MINIMIZING:
        animateMinimize();
        break;
      case WindowAnimationState.MINIMIZED:
        repositionWindow();
        break;
      case WindowAnimationState.INITIALIZING:
        setTimeout(() => {
          setAnimationState(WindowAnimationState.VISIBLE);
        }, 400);
        break;
      default:
        break;
    }
    motionScale.set(
      getScaleByAnimationState(animationState, isMaximized, firstRender),
    );
  }, [animationState, isMaximized, firstRender, motionScale]);

  useEffect(() => {
    if (!firstRender || !contentRef.current) return;
    checkOverflow();
    if (animationState === WindowAnimationState.OPENING) {
      setFirstRender(false);
      const { width, height } = {
        width: props.application.width || MIN_WIDTH,
        height: props.application.height || (props.isModal ? 50 : MIN_HEIGHT),
      };
      setCurrentWindowDimensions({
        ...currentWindowDimensions,
        width,
        height,
      });
      setPrevWindowDimensions({
        ...prevWindowDimensions,
        width,
        height,
      });
      if (props.application.width && props.application.height)
        setSizeInitialized(true);
    }
  }, [firstRender, contentRef, animationState]);

  useEffect(() => {
    if (!contentRef.current) return;
    if (!sizeInitialized && animationState === WindowAnimationState.VISIBLE) {
      setAnimationState(WindowAnimationState.INITIALIZING);
      const { clientWidth, clientHeight } = contentRef.current;
      const margin =
        titleBarHeight.value + (props.isModal ? 0 : statusBarHeight.value) + 8;
      if (!props.application.width) {
        setCurrentWindowDimensions({
          ...currentWindowDimensions,
          width: clientWidth + margin,
        });
        setPrevWindowDimensions({
          ...prevWindowDimensions,
          width: clientWidth + margin,
        });
      }
      if (!props.application.height) {
        setCurrentWindowDimensions({
          ...currentWindowDimensions,
          height: clientHeight + margin,
        });
        setPrevWindowDimensions({
          ...prevWindowDimensions,
          height: clientHeight + margin,
        });
      }
      setSizeInitialized(true);
    }
  }, [sizeInitialized, contentRef, animationState]);

  useEffect(() => {
    setMotionValues(currentWindowDimensions);
  }, [currentWindowDimensions, setMotionValues]);

  useEffect(() => {
    checkOverflow();
  }, [checkOverflow, navigation]);

  return (
    <motion.div
      className={`flex flex-col bg-retro-white absolute divide-y-3 divide-retro-dark border-3 rounded-lg border-retro-dark 
            ${isMaximized && !(animationState === WindowAnimationState.MINIMIZING) ? "border-b-0 shadow-window-maximized" : "shadow-window"}`}
      animate={{
        opacity: getOpacity(animationState),
      }}
      style={{
        x: motionX,
        y: motionY,
        width: motionWidth,
        height: motionHeight,
        scale: motionScale,
        willChange: isDragging.current ? "transform" : "auto",
      }}
      initial={{
        scale: 0.6,
        opacity: 0.1,
      }}
      ref={windowRef}
      onMouseDown={onInteract}
    >
      <div
        className={`titleBar flex flex-row ${titleBarHeight.className} w-full justify-between px-[6px] rounded-t-[4px] ${titleBarColor}`}
      >
        <div
          className="left-titleBar text-md text-retro-dark font-bold flex w-full flex-row items-center gap-3"
          onMouseDown={startDrag}
        >
          <span className={"select-none"}>{props.application.name}</span>
        </div>
        <div className="flex items-center right-titleBar">
          <div className="flex gap-2 items-end">
            {props.application.resizable !== false && (
              <div
                className="flex-grow justify-center hover:cursor-pointer pb-[1px]"
                onClick={props.onMinimize}
              >
                <Icon
                  className={"pt-[14px] pb-[3px] px-[4px]"}
                  icon={"minimize"}
                  size={13}
                  colorize={true}
                />
              </div>
            )}
            {props.application.resizable !== false && (
              <div
                className="flex items-center justify-center hover:cursor-pointer"
                onClick={maximizeHandler}
              >
                <Icon
                  className={"p-[4px]"}
                  icon={isMaximized ? "restoreDown" : "maximize"}
                  size={13}
                  colorize={true}
                />
              </div>
            )}
            <div
              className="flex items-center justify-center hover:cursor-pointer"
              onClick={props.onClose}
            >
              <Icon
                className={"p-[4px]"}
                icon={"close"}
                size={11}
                colorize={true}
              />
            </div>
          </div>
        </div>
      </div>
      <section
        className={`flex-grow flex flex-row ${scrollBarClassNames} ${
          animationState === WindowAnimationState.RESTORING ||
          animationState === WindowAnimationState.OPENING ||
          animationState === WindowAnimationState.INITIALIZING ||
          props.application.resizable === false ||
          !sizeInitialized
            ? "overflow-hidden"
            : "overflow-y-auto overflow-x-clip"
        }`}
        ref={containerRef}
      >
        <props.application.component
          ref={contentRef}
          {...props.application.props}
        >
          {props.application.children}
        </props.application.component>
        {isOverflowing &&
          animationState !== WindowAnimationState.INITIALIZING &&
          animationState !== WindowAnimationState.OPENING &&
          sizeInitialized && (
            <div
              className={
                "absolute z-200 right-[16px] bg-retro-dark w-[3px] scrollbar-right-border"
              }
              ref={scrollBarBorderRef}
            />
          )}
      </section>

      {!isMaximized && !props.isModal && (
        <div
          className={`${statusBarHeight.className} select-none flex flex-row-reverse rounded-b-lg ${props.application.resizable !== false ? "" : "bg-retro-medium"}`}
        >
          {props.application.resizable !== false && (
            <button
              className={`flex flex-row cursor-se-resize p-[2px] border-retro-dark h-full`}
              onMouseDown={startResize}
            >
              <Icon
                className={"text-retro-background self-end"}
                icon={"resize"}
                size={12}
                colorize={true}
              />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default Window;
