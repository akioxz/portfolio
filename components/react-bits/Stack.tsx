"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { useState, useEffect } from 'react';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
  onClick?: () => void;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false, onClick }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  function handleDragEnd(_event: any, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <div className="absolute inset-0 cursor-pointer" onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
}: StackProps) {
  const [visibleCards, setVisibleCards] = useState<React.ReactNode[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    setVisibleCards(cards);
    if (randomRotation) {
      const newRotations = cards.map(() => (Math.random() - 0.5) * 15);
      setRotations(newRotations);
    } else {
      setRotations(cards.map(() => 0));
    }
  }, [cards, randomRotation]);

  const sendToBack = (index: number) => {
    setVisibleCards((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      copy.push(removed);
      return copy;
    });

    setRotations((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      copy.push(removed);
      return copy;
    });
  };

  useEffect(() => {
    if (!autoplay || visibleCards.length <= 1) return;

    const interval = setInterval(() => {
      sendToBack(0);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, visibleCards]);

  if (visibleCards.length === 0) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {visibleCards.map((card, index) => {
        const isTop = index === 0;
        const rotation = rotations[index] || 0;

        return (
          <motion.div
            key={index}
            className="absolute w-full h-full"
            style={{
              zIndex: visibleCards.length - index,
              transformOrigin: 'center',
            }}
            animate={{
              rotate: rotation,
              scale: isTop ? 1 : 1 - index * 0.05,
              y: isTop ? 0 : index * 8,
            }}
            transition={{
              type: 'spring',
              ...animationConfig,
            }}
          >
            <CardRotate
              sensitivity={sensitivity}
              disableDrag={!isTop}
              onSendToBack={() => sendToBack(index)}
              onClick={sendToBackOnClick && isTop ? () => sendToBack(index) : undefined}
            >
              {card}
            </CardRotate>
          </motion.div>
        );
      })}
    </div>
  );
}
