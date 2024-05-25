import React, { useState } from 'react';
import styles from './home.module.scss';

type Card = {
  id: number;
  title: string;
  description: string;
  isEditing: boolean;
};

const Home = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddCard = () => {
    const newCard = { id: Date.now(), title, description, isEditing: false };
    setCards([...cards, newCard]);
    setTitle('');
    setDescription('');
  };

  const handleEditCard = (id: number) => {
    const card = cards.find(card => card.id === id);
    if (card) {
      setCards(cards.map(card => card.id === id ? { ...card, isEditing: true } : card));
      setTitle(card.title);
      setDescription(card.description);
    }
  };

  const handleSaveChanges = (id: number) => {
    setCards(cards.map(card => {
      if (card.id === id) {
        return { ...card, title: title, description: description, isEditing: false };
      }
      return card;
    }));
    setTitle('');
    setDescription('');
  };

  const handleDeleteCard = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div className={styles.cardManager}>
      <h1>Card Manager</h1>
      <div className={styles.cardForm}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button className={styles.button} onClick={handleAddCard}>Add Card</button>
      </div>
      <div className={styles.cardContainer}>
        {cards.map(card => (
          <div key={card.id} className={styles.card}>
            {card.isEditing ? (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button className={styles.button} onClick={() => handleSaveChanges(card.id)}>Save</button>
              </>
            ) : (
              <>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <button className={styles.button} onClick={() => handleEditCard(card.id)}>Edit</button>
                <button className={styles.button} onClick={() => handleDeleteCard(card.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
