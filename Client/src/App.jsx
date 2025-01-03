import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Card from './components/Card';
import LoginForm from './components/LoginForm';

const cardImages = [
  { src: '/img/helmet.png', matched: false },
  { src: '/img/potion.png', matched: false },
  { src: '/img/ring.png', matched: false },
  { src: '/img/scroll.png', matched: false },
  { src: '/img/shield.png', matched: false },
  { src: '/img/sword.png', matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [highScore, setHighScore] = useState(0);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          })
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const register = async (username, password) => {
    try {
      await axios.post('http://localhost:5000/users/register', {
        username,
        password,
      });
      login(username, password);
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/users/login', {
        username,
        password,
      });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setHighScore(res.data.user.highScore);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  const updateHighScore = async (newScore) => {
    if (!token) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/scores/update',
        { score: newScore },
        { headers: { 'x-access-token': token } }
      );
      setHighScore(res.data.highScore);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      updateHighScore(turns);
    }
  }, [cards]);

  return (
    <div className="App">
      <h1>Memory Match</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}</p>
          <p>Your High Score: {highScore}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <LoginForm login={login} register={register} />
      )}
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

export default App;
