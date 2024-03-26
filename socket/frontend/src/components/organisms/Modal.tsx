import React from "react";

export default function Modal({ children }: ModalProps) {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

type ModalProps = {
    children: React.ReactNode;
};