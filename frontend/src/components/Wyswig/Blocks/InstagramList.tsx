import React from "react";

import { createEditorStateWithText } from "@draft-js-plugins/editor";
import { BlockEditor } from "./EditorBlock";
import { CardDeck, InfoCard } from "../../CardDeck";
import { Form, Card, ButtonGroup, Button, Row } from "react-bootstrap";
import { GenericCardEditor } from "../GenericCardEditor";

interface IgDetails {
  handle: string,
  imagePath: string,
  href: string,
  bio: string,
}

interface IgCardState {
  orgName: string,
  handle: string,
  details?: IgDetails,
  resources: string[],
}

export const IgCardPanel: BlockEditor = {
  blockType: "IgCardPanel",
  create: (language) => ({
    blockType: "IgCardPanel",
    editorState: createEditorStateWithText(""), // Not used, but needed for interface
    data: [],
  }),
  replicateAcrossLanguage: (changedBlock, destinationBlock) => {
    const sourceCards = changedBlock.data as IgCardState[];
    const destCards = destinationBlock.data as IgCardState[];
    const destCardLookup = Object.fromEntries(destCards.map(block => [
      block.handle, block
    ]));
    const resultCards: IgCardState[] = [];
    sourceCards.forEach(card => {
      const handle = card.handle;
      if (handle in destCardLookup) {
        resultCards.push({
          ...card,
          resources: destCardLookup[handle]?.resources,
        });
      } else {
        resultCards.push({
          ...card
        });
      }
    });
    return {
      ...destinationBlock,
      data: resultCards,
    }
  },
  preUpload: async (block, client) => {
    const cards = block.data as IgCardState[];
    const handles = cards.map(card => card.handle);
    const details = await client.uploadHandles(handles);
    const madeCards = cards.map(card => ({
      ...card,
      details: {
        handle: card.handle,
        imagePath: details[card.handle].asset,
        href: `https://instagram.com/${card.handle}`,
        bio: ''
      },
    }));
    block.data = madeCards;
    return block;

  },
  Component: ({ state, readOnly, blockIndex, onChange, Sidebar }) => {
    if (readOnly) return <ReadOnlyIgCardBlock cardStates={state.data as IgCardState[]} />;
    return GenericCardEditor(
      onChange!,
      blockIndex,
      state,
      IgEditableCard,
      Sidebar, blankCard,
      (s: IgCardState) => s.handle,
    )
  }
}

const blankCard: () => IgCardState = () => ({
  orgName: "Org Name",
  handle: "handle",
  resources: []
})

const ReadOnlyIgCardBlock: React.FC<{ cardStates: IgCardState[] }> = ({ cardStates }) => {
  return <CardDeck fluid>
    {cardStates.map(c =>
      <InfoCard key={c.handle} title={c.orgName} href={c.details?.handle} imageUrl={c.details?.imagePath}>
        <p>
          {c.details?.bio}
          <br />
          {c.resources.length ? "Focus: " + c.resources.join(", ") : ""}
        </p>
      </InfoCard>)
    }
  </CardDeck>
}

interface EditableCardProps {
  state: IgCardState,
  cardIndex: number,
  onChange: (cardState: IgCardState, cardIndex: number) => void,
  dispatch: (action: 'Before' | 'After' | 'Delete', index: number) => void,
}


const IgEditableCard: React.FC<EditableCardProps> = ({ state, cardIndex, onChange, dispatch }) => {
  const cardStyle = {
    backgroundColor: "#3e5b47",
    fontSize: '5mm',
    maxWidth: '30%',
    marginTop: '5mm',
    marginBottom: '5mm'
  };
  const textChange = (key: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...state,
      [key]: evt.target.value
    }, cardIndex);
  }
  return <Card style={cardStyle}>
    <Card.Body>
      <Form>
        <Form.Group controlId="cardTitle" as={Row}>
          <Form.Label>Org Name:</Form.Label>
          <Form.Control type="text" placeholder="Enter Org Name" onChange={textChange("orgName")} value={state.orgName} size="sm" />
        </Form.Group>
        <Form.Group controlId="cardLink" as={Row}>
          <Form.Label>Handle:</Form.Label>
          <Form.Control type="text" placeholder="Enter Instagram Handle" onChange={textChange("handle")} value={state.handle} size="sm" />
        </Form.Group>
        <Form.Group controlId="snippet">
          <Form.Label>Areas of Work:</Form.Label>
          <Form.Control type="textarea" placeholder="Enter focuses as a list (e.g 'Focus1, Focus2, Focus3')" onChange={textChange("resources")} value={state.resources} as="textarea" />
        </Form.Group>
      </Form>
      <ButtonGroup>
        <Button onClick={() => dispatch('Before', cardIndex)}>Insert Card Before</Button>
        <Button onClick={() => dispatch('After', cardIndex)}>Insert Card After</Button>
        <Button onClick={() => dispatch('Delete', cardIndex)}>Delete Card</Button>
      </ButtonGroup>
    </Card.Body>
  </Card>
}