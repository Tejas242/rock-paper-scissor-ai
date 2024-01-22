"use client"

// Import necessary modules and styles
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import {recurrent, utilities} from 'brain.js';

// Define the component
const RockPaperScissors: FC = () => {
  // State variables
  const [pattern, setPattern] = useState<number[]>([]);
  const [scoreHuman, setScoreHuman] = useState(0);
  const [scoreAI, setScoreAI] = useState(0);
  const [chosenByHuman, setChosenByHuman] = useState(0);
  const [chosenByAI, setChosenByAI] = useState(0);
  const [winner, setWinner] = useState<string>('');
  const [gameCount, setGameCount] = useState(0);
  const patternLength = 10;

  // useEffect to simulate component lifecycle methods
  useEffect(() => {
  const fetchData = async () => {
    await whatShouldAIAnswer();
  };

  fetchData();
  }, []);

  // Methods
  const humanInput = (rockOrPaperOrScissors: number) => {
    setChosenByHuman(rockOrPaperOrScissors);
    setGameCount(gameCount + 1);
  };

  const prepareData = () => {
    if (pattern.length < 1) {
      const newPattern = Array.from({ length: patternLength }, () =>
        Math.floor(Math.random() * 3) + 1
      );
      setPattern(newPattern);
    }
  };

  const updatePattern = () => {
    if (gameCount !== 0) {
      const newPattern = [...pattern];
      newPattern.shift();
      newPattern.push(chosenByHuman);
      setPattern(newPattern);
    }
  };

  const whatShouldAIAnswer = async () => {
    prepareData();

    const net = new recurrent.LSTMTimeStep();
    net.train([pattern], { iterations: 100, log: true });
    const humanWillChose = net.run(pattern);

    updatePattern();

    const roundedHumanWillChose = Math.round(humanWillChose);
       

    setChosenByAI(
      roundedHumanWillChose >= 1 && roundedHumanWillChose <= 3
        ? (roundedHumanWillChose % 3) + 1
        : 1
    );

    whoIsTheWinner();
  };

  const whoIsTheWinner = () => {
    if (chosenByHuman === chosenByAI) {
      setWinner('draw');
    } else if (
      (chosenByHuman === 1 && chosenByAI === 3) ||
      (chosenByHuman === 3 && chosenByAI === 2) ||
      (chosenByHuman === 2 && chosenByAI === 1)
    ) {
      setWinner('human');
      setScoreHuman(scoreHuman + 1);
    } else {
      setWinner('AI');
      setScoreAI(scoreAI + 1);
    }
  };

  const resetScore = () => {
    setPattern([]);
    setScoreHuman(0);
    setScoreAI(0);
    setChosenByHuman(0);
    setChosenByAI(0);
    setWinner('');
    setGameCount(0);
  };

  const stringOf = (integer: number) => {
    switch (integer) {
      case 1:
        return 'Rock';
      case 2:
        return 'Paper';
      case 3:
        return 'Scissors';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto lg:flex lg:justify-evenly lg:items-start">
      <div className="flex flex-col items-center justify-center text-center lg:mt-10">
        <div className="flex justify-end w-full p-4">
          {/* English Link */}
          <Link href="/">
            <span className="inline-flex items-center px-4 py-2 text-white duration-500 bg-indigo-500 rounded-md hover:bg-indigo-600">
              English
            </span>
          </Link>

          {/* Indonesian Link */}
          <Link href="/">
            <span className="inline-flex items-center px-4 py-2 text-white duration-500 bg-indigo-500 rounded-md hover:bg-indigo-600">
              Indonesian
            </span>
          </Link>
        </div>

        <div className="p-4">
          <h1 className="text-3xl font-bold text-indigo-500">Title</h1>
          <h2 className="text-base text-indigo-500">Subtitle</h2>
        </div>

        <div className="p-4">
          {/* Score section */}
          <h2 className="text-2xl font-semibold text-indigo-500">
            {scoreHuman} - {scoreAI}
          </h2>
          <div className="flex items-center mt-4 items-row justify-evenly">
            {/* Human score */}
            <div className="w-1/2 border-r border-indigo-500">
              <p className="text-3xl text-indigo-500">{scoreHuman}</p>
              <p className="mt-4 text-xl">Human</p>
              <p className="mt-4">{stringOf(chosenByHuman)}</p>
            </div>

            {/* AI score */}
            <div className="w-1/2">
              <p className="text-3xl text-indigo-500">{scoreAI}</p>
              <p className="mt-4 text-xl">AI</p>
              <p className="mt-4">{stringOf(chosenByAI)}</p>
            </div>
          </div>

          {/* Winner display */}
          <div className="my-6 text-2xl font-bold">
            {winner === 'human' && (
              <p className="text-indigo-500">You Win!</p>
            )}
            {winner === 'AI' && <p className="text-red-500">You Lose!</p>}
            {winner === 'draw' && <p className="text-blue-500">It's a Draw!</p>}
            {!winner && <p className="text-gray-700">Game Start</p>}
          </div>

          {/* Game buttons */}
          <div className="mt-4">
            <div className="flex flex-row items-center justify-center">
              <button
                onClick={() => humanInput(1)}
                className="px-4 py-2 m-2 text-white duration-500 bg-indigo-500 rounded hover:bg-indigo-600"
              >
                Rock
              </button>
              <button
                onClick={() => humanInput(2)}
                className="px-4 py-2 m-2 text-white duration-500 bg-indigo-500 rounded hover:bg-indigo-600"
              >
                Paper
              </button>
              <button
                onClick={() => humanInput(3)}
                className="px-4 py-2 m-2 text-white duration-500 bg-indigo-500 rounded hover:bg-indigo-600"
              >
                Scissors
              </button>
            </div>

            {/* Reset button */}
            <div>
              <button
                onClick={resetScore}
                className="px-4 py-2 m-2 text-indigo-500 border rounded"
              >
                Reset
              </button>
            </div>

            {/* Game count */}
            <div className="mt-8">
              <p>Game Count: {gameCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional information */}
      <div className="lg:ml-16">
        {/* What section */}
        <div className="p-4 mt-4 prose lg:prose-xl">
          <h2>What</h2>
          <div>
            <p>This is a simple Rock-Paper-Scissors game with AI.</p>
            <p>Built with Next.js, TypeScript, Tailwind CSS, and Brain.js.</p>
          </div>
        </div>

        {/* How section */}
        <div className="p-4 mt-4 prose lg:prose-xl">
          <h2>How</h2>
          <div>
            <ol>
              <li>Step 1</li>
              <li>Step 2</li>
              <li>
                Step 3
                <ul>
                  <li>Pattern 1</li>
                  <li>Pattern 2</li>
                  <li>Pattern 3</li>
                  <li>Pattern 4</li>
                </ul>
              </li>
              <li>Step 4</li>
            </ol>
          </div>
        </div>

        {/* Source section */}
        <div className="p-4 mt-4 prose lg:prose-xl">
          <h2>Source</h2>
          <div>
            <p>
              Brain.js:
              <a href="https://github.com/BrainJS/brain.js">Brain JS</a>
            </p>
            <p>
              Github:
              <a href="https://github.com/arifikhsan/batu-gunting-kertas-nuxt">
                Github
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissors;
