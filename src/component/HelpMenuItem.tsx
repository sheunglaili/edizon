import React, { useCallback, useState } from "react";
import { Instruction } from "./HelpMenu";
import { useSetRecoilState } from "recoil";
import { intentState, AnalysedIntent } from "../state/nlp";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  makeStyles,
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Button,
  Grid,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

type Props = {
  onSubmit: () => void;
} & Instruction;

export const useStyles = makeStyles((theme) => ({
  nested: {
    width: "100%",
  },
}));

export default function HelpMenuItem({
  primary,
  secondary,
  action,
  entities,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const set = useSetRecoilState(intentState);
  const styles = useStyles();

  const onClickWithoutParam = useCallback(
    (action) => {
      onSubmit();
      set({
        intent: action,
        entities: {},
      });
    },
    [set, onSubmit]
  );

  const onClickWithParam = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const dispatchIntentWithParam = useCallback(
    (evt, action) => {
      evt.preventDefault();
      const data = new FormData(evt.target);
      const parsed = Object.fromEntries(data);
      const intent: AnalysedIntent = {
        intent: action,
        entities: {
          ...Object.fromEntries(
            Object.entries(parsed).map(([key, value]) => [
              key,
              [{ value: value.toString() }],
            ])
          ),
        },
      };
      set(intent);
      onSubmit();
    },
    [onSubmit, set]
  );

  return (
    <>
      <ListItem
        button
        onClick={
          entities ? onClickWithParam : () => onClickWithoutParam(action)
        }
      >
        <ListItemText primary={primary} secondary={secondary} />
        {entities && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <form onSubmit={(evt) => dispatchIntentWithParam(evt, action)}>
            {entities?.map(({ key, name, type, description, required }) => (
              <ListItem className={styles.nested}>
                <FormControl variant="outlined">
                  <InputLabel htmlFor={key}>{name}</InputLabel>
                  <Input name={key} type={type} id={key} required={required} />
                  <FormHelperText variant="outlined" id={`${key}-text`}>
                    {description}
                  </FormHelperText>
                </FormControl>
              </ListItem>
            ))}
            <ListItem>
              <Grid container justify="flex-end">
                <Button type="submit">Action</Button>
              </Grid>
            </ListItem>
          </form>
        </List>
      </Collapse>
    </>
  );
}
