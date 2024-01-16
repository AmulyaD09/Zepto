import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
  profilePic: string;
}

interface Chip {
  id: number;
  user: User;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([
    { id: 1, name: 'Steve Mark', email: 'stevemark@example.com', profilePic: 'steve.jpg' },
    { id: 2, name: 'Nick Garner', email: 'nickgarner@example.com', profilePic: 'nick.jpg' },
    { id: 3, name: 'Tom Giannopoulos', email: 'tomgg@example.com', profilePic: 'tom.jpg' },
    { id: 4, name: 'Tony Williams', email: 'tony@example.com', profilePic: 'tony.jpg' },
    { id: 5, name: 'Hercules Lant', email: 'hercules@example.com', profilePic: 'hercules.jpg' },
    { id: 6, name: 'Sam Albert', email: 'sam@example.com', profilePic: 'sam.jpg' },
  ]);
  const [isUserListVisible, setIsUserListVisible] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsUserListVisible(true);
  };

  const handleInputClick = () => {
    setIsUserListVisible(true);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleChipAdd(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
      handleChipRemove(chips[chips.length - 1].id);
    }
  };

  const handleChipAdd = (itemName: string) => {
    const selectedUser = availableUsers.find(
      (user) => user.name.toLowerCase() === itemName.toLowerCase()
    );

    if (selectedUser) {
      const newChips: Chip[] = [...chips, { id: chips.length + 1, user: selectedUser }];
      const newAvailableUsers = availableUsers.filter((user) => user.id !== selectedUser.id);

      setChips(newChips);
      setAvailableUsers(newAvailableUsers);
      setInputValue('');
    }
  };

  const handleChipRemove = (chipId: number) => {
    const removedChip = chips.find((chip) => chip.id === chipId);

    if (removedChip) {
      const newChips = chips.filter((chip) => chip.id !== chipId);
      const newAvailableUsers = [...availableUsers, removedChip.user].sort((a, b) => a.id - b.id);

      setChips(newChips);
      setAvailableUsers(newAvailableUsers);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Pick Users</h1>
      <div className="flex flex-wrap mb-4">
        {chips.map((chip) => (
          <div key={chip.id} className="chip">
            <div className="icon">👤</div>
            <div className="user-info">
              <div>{chip.user.name}</div>
            </div>
            <button onClick={() => handleChipRemove(chip.id)}>&times;</button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          placeholder={availableUsers.length > 0 ? 'Add new user...' : ''}
          className="input-field"
        />
        {isUserListVisible && availableUsers.length > 0 && (
          <ul className="suggestion-list">
            {availableUsers
              .filter((user) => user.name.toLowerCase().includes(inputValue.toLowerCase()))
              .map((user) => (
                <li key={user.id} onClick={() => handleChipAdd(user.name)}>
                  <div className="icon">👤</div>
                  <div className="user-info">
                    <div>{user.name}</div>
                    <div className="email">{user.email}</div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default App;
