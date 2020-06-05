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

interface Parameter {
  name: string;
  key: string;
  description?: string;
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

const instructions: Instruction[] = [
  {
    primary: "Clear the canvas",
    secondary: "Clear the canvas for your next operation",
    action: "clear",
  },
  {
    primary: "Apply Filter 'name'",
    secondary: "Apply the filter to canvas",
    action: "apply_filter",
    entities: [
      {
        name: "Filter name",
        key: "vedit_filter:vedit_filter",
        description: "The filter name you wanna apply to the canvas",
        required: true,
      },
    ],
  },
];

export default function HelpMenu() {
  const [{ intent }] = useRecoilState(intentState);
  const setIntent = useSetRecoilState(intentState);
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
    console.log('close')
  }, []);

  useEffect(() => {
    if (intent === "ask_for_help") {
      setOpen(true);
    }
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
