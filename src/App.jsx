import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBoard, addList, addCard, updateLists } from "./features/boardSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import './App.css'

function App() {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards) || [];
  const [boardName, setBoardName] = useState("");
  const [listName, setListName] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const handleAddBoard = () => {
    if (boardName.trim()) {
      dispatch(addBoard({ boardName }));
      setBoardName("");
    }
  };

  const handleAddList = () => {
    if (listName.trim() && selectedBoardId !== null) {
      dispatch(addList({ boardId: selectedBoardId, listName }));
      setListName("");
    }
  };

  const handleAddCard = (boardId, listId) => {
    if (cardName.trim()) {
      dispatch(addCard({ boardId, listId, cardName }));
      setCardName("");
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const board = boards.find((b) => b.id === selectedBoardId);

    if (board) {
      const updatedLists = Array.from(board.lists);
      const [movedItem] = updatedLists.splice(source.index, 1);
      updatedLists.splice(destination.index, 0, movedItem);

      dispatch(updateLists({ boardId: selectedBoardId, lists: updatedLists }));
    }
  };

  return (
    <div>
      <h1>Trello Clone</h1>

      {/* Add Board */}
      <div>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Enter board name"
        />
        <button onClick={handleAddBoard}>Add Board</button>
      </div>

      {/* Render Boards */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          {boards.map((board) => (
            <div key={board.id}>
              <h2 onClick={() => setSelectedBoardId(board.id)}>{board.name}</h2>
              {selectedBoardId === board.id && (
                <>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name"
                  />
                  <button onClick={handleAddList}>Add List</button>
                </>
              )}

              {/* Lists */}
              <Droppable droppableId={String(board.id)}>
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {board.lists.map((list, index) => (
                      <Draggable key={list.id} draggableId={String(list.id)} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h3>{list.name}</h3>

                            {/* Cards */}
                            <Droppable droppableId={String(list.id)}>
                              {(provided) => (
                                <ul {...provided.droppableProps} ref={provided.innerRef}>
                                  {list.cards.map((card, idx) => (
                                    <li key={card.id}>{card.name}</li>
                                  ))}
                                  {provided.placeholder}
                                </ul>
                              )}
                            </Droppable>

                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="Enter card name"
                            />
                            <button onClick={() => handleAddCard(board.id, list.id)}>
                              Add Card
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
