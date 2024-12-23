import React, { forwardRef } from "react";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import { IconName } from "@/assets/icons";

export interface ModalProps {
  title: string;
  message: string;
  icon: IconName;
  onConfirm?: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const { title, message, icon, onConfirm, confirmText, onCancel, cancelText } =
    props;

  return (
    <div
      ref={ref}
      className={"w-full h-fit text-retro-dark font-pixolde flex-grow"}
    >
      <div className={"p-6"}>
        <div className={"flex flex-row gap-2 items-center"}>
          <Icon
            icon={icon}
            size={48}
            colorize={true}
            className={"-mb-4 float-left mr-3"}
          />
          <h2 className={"mt-0"}>{title}</h2>
        </div>
        <div className={"ml-[68px]"}>
          <p className={"mt-0"}>{message}</p>
        </div>
      </div>
      <div
        className={
          "p-4 bg-retro-medium flex text-[22px] font-bold flex-row gap-3 items-center"
        }
      >
        {onConfirm && confirmText && (
          <Button label={confirmText} onClick={onConfirm} />
        )}
        {onCancel && cancelText && (
          <Button label={cancelText} onClick={onCancel} />
        )}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;
