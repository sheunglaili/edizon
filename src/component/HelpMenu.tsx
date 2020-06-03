import React, { useEffect, useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { nlpQuery } from "../state/nlp";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";

interface Instruction {
  primary: string;
  secondary: string;
  action: string;
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
    primary: "What can I do",
    secondary: "Show help menu to show you command",
    action: "ask_for_help",
  },
];

export default function HelpMenu() {
  const intent = useRecoilValue(nlpQuery);
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (intent?.intents[0]?.name === "ask_for_help") {
      setOpen(true);
    }
  }, [intent]);

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>What can you do ?</DialogTitle>
      <DialogContent>
        <List>
          {instructions.map(({ primary, secondary, action }) => (
            <ListItem key={action}>
              <ListItemText primary={primary} secondary={secondary} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
