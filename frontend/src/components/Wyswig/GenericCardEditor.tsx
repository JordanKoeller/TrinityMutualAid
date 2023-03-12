import React from 'react';
import { EditorBlock } from './Blocks/EditorBlock';
import { Jumbotron } from "../Jumbotron";
import { Form, Card, ButtonGroup, Button, Row } from "react-bootstrap";
import { CardDeck, InfoCard } from "../CardDeck";
import { Editor } from 'draft-js';



interface EditableCardProps<S> {
  state: S,
  cardIndex: number,
  onChange: (state: S, index: number) => void,
  dispatch: (action: 'Before' | 'After' | 'Delete', ind: number) => void,
}

export function GenericCardEditor<S>(
  onChange: (state: EditorBlock, index: number) => void,
  blockIndex: number,
  state: EditorBlock,
  EditableCard: React.FC<EditableCardProps<S>>,
  Sidebar: any,
  blankCard: () => S,
  getId: (s: S) => string,
) {
  const cardChange = (cardState: S, cardIndex: number) => {
    const newState = { ...state };
    newState.data = [...newState.data];
    newState.data[cardIndex] = { ...cardState };
    onChange(newState, blockIndex);
  }
  const addCard = () => {
    const newState = { ...state };
    newState.data = [...newState.data];
    newState.data.push(blankCard());
    onChange?.(newState, blockIndex);
  }
  const dispatch = (action: 'Before' | 'After' | 'Delete', ind: number) => {
    const newState = { ...state };
    newState.data = newState.data.map((elem: any) => ({ ...elem }));
    if (action === 'Before') newState.data.splice(ind, 0, blankCard());
    if (action === 'After') newState.data.splice(ind + 1, 0, blankCard());
    if (action === 'Delete') newState.data.splice(ind, 1);
    onChange(newState, blockIndex);
  }


  return <Jumbotron variant={blockIndex % 2 === 0 ? "light" : "dark"}>
    <CardDeck fluid>
      {
        state.data.map((c: S, i: number) =>
          <EditableCard key={getId(c)} state={c} cardIndex={i} onChange={cardChange} dispatch={dispatch} />)
      }
    </CardDeck>
    <ButtonGroup>
      {Sidebar}
      <Button onClick={addCard}>Add Card</Button>
    </ButtonGroup>
  </Jumbotron>
}