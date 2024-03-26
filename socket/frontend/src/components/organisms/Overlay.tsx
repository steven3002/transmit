import { createPortal } from "react-dom";
import Modal from "./Modal";
import React from "react";

const mountElement = document.getElementById("overlay");

export default function Overlay({ isOpen, children }: OverlayProps) {
    return createPortal(
        <div
            className={`${
                isOpen
                    ? "fixed inset-0 z-50 flex items-center justify-center bg-[#000] bg-opacity-40"
                    : ""
            }`}
        >
            {isOpen && (
                <div>
                    <Modal>{children}</Modal>
                </div>
            )}
        </div>,
        mountElement as HTMLElement
    );
};

type OverlayProps = {
    children: React.ReactNode;
    isOpen: boolean;
};