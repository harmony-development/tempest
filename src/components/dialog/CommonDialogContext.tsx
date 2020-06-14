// partially derived from https://dev.to/dmtrkovalenko/the-neatest-way-to-handle-alert-dialogs-in-react-1aoe

import React from "react";

import { CommonDialog } from "./CommonDialog";

interface IDialogOptions {
  title: string;
  description: string;
  type: "confirm" | "alert";
}

interface IProps {
  children: JSX.Element;
}

const CommonDialogContext = React.createContext<
  (options: IDialogOptions) => Promise<void>
>(Promise.reject);

export const CommonDialogContextProvider = ({ children }: IProps) => {
  const [dialogState, setConfirmState] = React.useState<IDialogOptions | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const pendingDialogRef = React.useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const openDialog = (options: IDialogOptions) => {
    setConfirmState(options);
    setDialogOpen(true);
    return new Promise<void>((resolve, reject) => {
      pendingDialogRef.current = { resolve, reject };
    });
  };

  const cancelHandler = () => {
    if (pendingDialogRef.current) {
      if (dialogState?.type === "confirm") {
        pendingDialogRef.current.reject();
      }
      pendingDialogRef.current.resolve();
    }
    setDialogOpen(false);
  };

  const confirmHandler = () => {
    if (pendingDialogRef.current) {
      pendingDialogRef.current.resolve();
    }
    setDialogOpen(false);
  };

  const exitHandler = () => {
    setConfirmState(null);
  };

  return (
    <>
      <CommonDialogContext.Provider value={openDialog}>
        {children}
      </CommonDialogContext.Provider>
      <CommonDialog
        onSubmit={confirmHandler}
        onClose={cancelHandler}
        onExited={exitHandler}
        open={dialogOpen}
        {...dialogState}
      />
    </>
  );
};

export const useDialog = () => React.useContext(CommonDialogContext);
