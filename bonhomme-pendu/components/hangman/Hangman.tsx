import React, { useEffect, useRef, useState } from 'react';
import './hangman.css';

interface HangmanProps {
  nbWrongGuesses: number;
}

export const Hangman: React.FC<HangmanProps> = ({ nbWrongGuesses }) => {
  const partsRef = useRef<HTMLImageElement[]>([]);
  const [visibleParts, setVisibleParts] = useState<boolean[]>([]);

  useEffect(() => {
    // Initialiser le tableau de visibilité
    const initialVisibility = new Array(8).fill(false);
    setVisibleParts(initialVisibility);
  }, []);

  useEffect(() => {
    // Mettre à jour les parties visibles en fonction du nombre de mauvaises tentatives
    const newVisibility = new Array(8).fill(false);
    for (let i = 0; i < Math.min(nbWrongGuesses, 8); i++) {
      newVisibility[i] = true;
    }
    setVisibleParts(newVisibility);
  }, [nbWrongGuesses]);

  const hangmanImages = [
    { src: 'assets/hangman1.png', alt: 'head' },
    { src: 'assets/hangman2.png', alt: 'body' },
    { src: 'assets/hangman3.png', alt: 'rightLeg' },
    { src: 'assets/hangman4.png', alt: 'leftLeg' },
    { src: 'assets/hangman5.png', alt: 'rightArm' },
    { src: 'assets/hangman6.png', alt: 'leftArm' },
    { src: 'assets/hangman7.png', alt: 'eyes' },
  ];

  return (
    <div style={{ position: 'relative', height: '350px' }}>
      <img
        style={{ position: 'absolute', top: 0, zIndex: 0 }}
        src="assets/hangman0.png"
        alt="potence"
      />
      {hangmanImages.map((image, index) => (
        <img
          key={index}
          ref={(el) => {
            if (el) partsRef.current[index] = el;
          }}
          className={`part ${visibleParts[index] ? 'fadeIn' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            zIndex: index + 1,
            opacity: visibleParts[index] ? 1 : 0,
          }}
          src={image.src}
          alt={image.alt}
        />
      ))}
    </div>
  );
};
