import React, { useEffect, useState, useCallback } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { intentState } from "../state/nlp";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  List,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import HelpMenuItem from "./HelpMenuItem";
import instructions from '../help-menu'

interface Parameter {
  name: string;
  key: string;
  description?: string;
  default?: string;
  required: boolean;
  type?: "text" | "password" | "number";
}

export interface Instruction {
  primary: string;
  secondary: string;
  action: string;
  entities?: Parameter[];
}

const Transition = React.forwardRef<any, TransitionProps>(
  ({ children, ...rest }, ref) => {
    return (
      <Slide
        children={React.isValidElement(children) ? children : undefined}
        direction="up"
        ref={ref}
        {...rest}
      />
    );
  }
);


export default function HelpMenu() {
  const [{ intent }, setIntent] = useRecoilState(intentState);
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    setOpen(false);
    setIntent({
      intent: "",
      entities: {},
    });
  }, [setIntent]);

  const onDispatch = useCallback(() => {
    setOpen(false);
    console.log("close");
  }, []);

  useEffect(() => {
    const askingForHelp = intent === "ask_for_help"
    setOpen(askingForHelp); 
  }, [intent, open]);

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>What can you do ?</DialogTitle>
      <DialogContent>
        <List>
          {instructions.map(({ primary, secondary, action, entities }) => (
            <HelpMenuItem
              key={action}
              primary={primary}
              secondary={secondary}
              action={action}
              entities={entities}
              onSubmit={onDispatch}
            />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
