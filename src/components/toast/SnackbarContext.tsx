import React, { useState, useCallback } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";

interface IToastOptions {
  severity?: Color;
  message: string;
}

const ToastContext = React.createContext<
  ((options: IToastOptions) => void) | undefined
>(undefined);

export const ToastContextProvider = React.memo(
  ({ children }: { children: JSX.Element }) => {
    const [open, setOpen] = useState(false);
    const [toastOptions, setToastOptions] = useState<IToastOptions>();

    const openToast = useCallback((options: IToastOptions) => {
      setToastOptions(options);
      setOpen(true);
    }, []);

    const closeHandler = useCallback(() => {
      setOpen(false);
    }, []);

    const exitHandler = useCallback(() => {
      setToastOptions(undefined);
    }, []);

    return (
      <>
        <ToastContext.Provider value={openToast}>
          {children}
        </ToastContext.Provider>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={closeHandler}
          onExited={exitHandler}
        >
          <Alert severity={toastOptions?.severity} onClose={closeHandler}>
            {toastOptions?.message}
          </Alert>
        </Snackbar>
      </>
    );
  }
);

export const useToast = () => {
  const snackbar = React.useContext(ToastContext);
  if (!snackbar) throw Error("i need context");
  return snackbar;
};
