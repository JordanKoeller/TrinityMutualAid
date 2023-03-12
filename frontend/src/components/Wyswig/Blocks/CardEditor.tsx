import React from "react";
import { createEditorStateWithText } from "@draft-js-plugins/editor";
import { BlockEditor, } from "./EditorBlock";
import { CardDeck, InfoCard } from "../../CardDeck";
import { Form, Card, ButtonGroup, Button, Row } from "react-bootstrap";
import { Jumbotron } from "../../Jumbotron";
import * as uuid from 'uuid';
import { GenericCardEditor } from "../GenericCardEditor";

interface CardState {
    file?: File,
    filename?: string,
    dataUrl?: string,
    title: string,
    snippet: string,
    href: string,
    uuid: string,
}

const blankCard: () => CardState = () => ({
    title: "",
    snippet: "",
    href: "",
    uuid: uuid.v4()
});


export const CardEditor: BlockEditor = {
    blockType: "CardPanel",
    create: (language) => ({
        blockType: "CardPanel",
        editorState: createEditorStateWithText(""), // editorState isn't used. Just need to satisfy interface
        data: []
    }),
    Component: ({ state, readOnly, blockIndex, onChange, Sidebar }) => {
        if (readOnly) return <ReadonlyCardBlock cardStates={state.data as CardState[]} />;
        return GenericCardEditor(
          onChange!,
          blockIndex,
          state,
          EditableCard,
          Sidebar,
          blankCard,
          (s: CardState) => s.uuid);


    },
    scrubImages: (block, imageRecord) => block.data.forEach((card: CardState) => {
        if (card.file?.size && card.filename) {
            imageRecord[card.filename] = card.file;
        }
    }),
    replaceImages: (block, imagesToUrl) => block.data.forEach((card: CardState) => {
        if (card.filename && card.filename in imagesToUrl && card.file?.size) {
            card.dataUrl = imagesToUrl[card.filename];
        }
    }),
    replicateAcrossLanguage: (changedBlock, destinationBlock) => {
        // I want to copy over file uploads/block changes, but NOT the text.
        const blocksInChangedData = changedBlock.data as CardState[];
        const blocksInDestData = destinationBlock.data as CardState[];
        const destBlockLookup = Object.fromEntries(blocksInDestData.map((block) => [
            block.uuid, block
        ]));
        const resultBlocks: CardState[] = [];
        blocksInChangedData.forEach((block) => {
            if (block.uuid in destBlockLookup) {
                resultBlocks.push({
                    ...block,
                    title: destBlockLookup[block.uuid]?.title,
                    snippet: destBlockLookup[block.uuid]?.snippet,
                });
            } else {
                resultBlocks.push({
                    ...block,
                    title: "",
                    snippet: "",
                });
            }
        });
        return {
            ...destinationBlock,
            data: resultBlocks
        };
    }
}

const ReadonlyCardBlock: React.FC<{ cardStates: CardState[] }> = ({ cardStates }) => {
    return <CardDeck fluid>
        {
            cardStates.map((c, i) => <InfoCard key={`${c.uuid}-${i}`} title={c.title} href={c.href}>
                <img alt="" src={c.dataUrl} width="100%" />
                    {c.snippet}
            </InfoCard>
            )
        }
    </CardDeck>;
}

interface EditableCardProps {
    state: CardState,
    cardIndex: number,
    onChange: (cardState: CardState, cardIndex: number) => void,
    dispatch: (action: 'Before' | 'After' | 'Delete', index: number) => void,
}

const EditableCard: React.FC<EditableCardProps> = ({ state, cardIndex, onChange, dispatch }) => {
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
    const handleUploadChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            const file = evt.target.files?.[0]!;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                onChange({
                    ...state,
                    filename: file.name,
                    dataUrl: reader.result as string,
                    file: file,
                }, cardIndex);
            }
        }
    };
    return <Card style={cardStyle}>
        <Card.Body>
            <Form>
                <Form.Group controlId="cardTitle" as={Row}>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control type="text" placeholder="Enter Title" onChange={textChange("title")} value={state.title} size="sm" />
                </Form.Group>
                <Form.Group controlId="cardLink" as={Row}>
                    <Form.Label>Link:</Form.Label>
                    <Form.Control type="url" placeholder="Enter Link to article" onChange={textChange("href")} value={state.href} size="sm" />
                </Form.Group>
                <Form.Group controlId="fileUpload" as={Row}>
                    <Form.Label>Image:</Form.Label>
                    <Form.Control type="file" onChange={handleUploadChange} size="sm" />
                    <img src={state.dataUrl as string} alt="" style={{
                        objectFit: 'contain',
                    }} />
                </Form.Group>
                <Form.Group controlId="snippet">
                    <Form.Label>Snippet:</Form.Label>
                    <Form.Control type="textarea" placeholder="Enter description (150 characters max)" onChange={textChange("snippet")} value={state.snippet} as="textarea" />
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