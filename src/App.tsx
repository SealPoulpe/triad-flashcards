import React from 'react';
import styles from './App.module.css';

const scales = ['Major'/*, 'Minor'*/];
const intervals = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh'];

const blendedNotes = ['A', 'AB', 'B', 'C', 'CD', 'D', 'DE', 'E', 'F', 'FG', 'G', 'GA'];

type baseNote =
{
  note : string,
  blendedIndex : number
};

// Base notes, combined with blended indexes.
const baseNotes: Array<baseNote> = [ 
                                      {note: 'A', blendedIndex: 0},
                                      {note: 'B', blendedIndex: 2},
                                      {note: 'C', blendedIndex: 3},
                                      {note: 'D', blendedIndex: 5},
                                      {note: 'E', blendedIndex: 7},
                                      {note: 'F', blendedIndex: 8},
                                      {note: 'G', blendedIndex: 10}, 
                                   ];

function stringifyBlendedNote( blendedNote: string): string
{
  if(blendedNote.length === 2)
  {
    return blendedNote.charAt(0) + '♯ / ' + blendedNote.charAt(1) + "♭";
  }
  
  return blendedNote;
}

function ensureBlendedIndexInRange(blendedNoteIndex: number): number
{
  if(blendedNoteIndex === -1)
  {
    return blendedNotes.length - 1;
  }

  return blendedNoteIndex % blendedNotes.length;
}

//major scale - first -> W W H W W W H
const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];

//minor scale - first -> W H W W H W W
const minorScaleIntervals = [0, 2, 3, 5, 7, 8, 10];

function getCorrectNoteIndex (scaleIndex: number, noteIndex: number, intervalIndex: number): number
{
  if(scales[scaleIndex] === 'Major')
  {
    return ensureBlendedIndexInRange(noteIndex + majorScaleIntervals[intervalIndex]);
  } 
  else
  {
    return ensureBlendedIndexInRange(noteIndex + minorScaleIntervals[intervalIndex]);
  } 
}

function getRandomIndex(array : string[]) {
  return Math.floor(Math.random() * array.length);
};

function App() {
  const [note, setNote] = React.useState(getRandomIndex(blendedNotes));
  const [interval, setInterval] = React.useState(getRandomIndex(intervals));
  const [correctNote, setCorrectNote] = React.useState(getCorrectNoteIndex(0, note, interval));

  const [correctnessString, setCorrectnessString] = React.useState('Good Luck!');
  const [correctnessOpacity, setCorrectnessOpacity] = React.useState(styles.answerVisible);
  const [score, setScore] = React.useState(0);
  const [totalAnswers, settotalAnswers] = React.useState(0);

  // When score is incremented (ie a correct answer has been given), reset with a new problem
  // React.useCallback(() => {

  // }, [score]);

  function generateNewProblem(){
    let newNote = getRandomIndex(blendedNotes);
    setNote(newNote);

    let newInterval = getRandomIndex(intervals);
    setInterval(newInterval);

    setCorrectNote(getCorrectNoteIndex(0, newNote, newInterval));
  }

  function handleAnswerSubmission(submittedNoteIndex : number): void{

    // Debug
    console.log('Submitted Note: ' + stringifyBlendedNote(blendedNotes[submittedNoteIndex]));
    console.log('Correct Note: ' + stringifyBlendedNote(blendedNotes[correctNote]));

    if(submittedNoteIndex === correctNote)
    {
      //correct answer
      setCorrectnessString('Correct!');
      setScore(score+1);

      generateNewProblem();
    }
    else
    {
      //incorrect answer
      setCorrectnessString('Incorrect!');
    }
    
    setTimeout(()=>{setCorrectnessOpacity(styles.answerVisible);}, 0);
    setCorrectnessOpacity(styles.answerInvisible);

    settotalAnswers(totalAnswers+1);
  };

  return (
    <div className={styles.container}>
        <Task targetNote={note} interval={interval}/>
        <br/>
        <Buttons onHandleSubmit={handleAnswerSubmission}/>
        <br/>
        <Results correctnessString={correctnessString} correctnessOpacity={correctnessOpacity} score={score} totalAnswers={totalAnswers}/>
    </div>
  );
}


// TODO: REFACTOR INTO COMPONENT FILE
// BUTTONS  ----------------------------------------------------------------------------------------------------------------------------------------
type ButtonsProps = {
  onHandleSubmit: (submittedNoteIndex : number) => void;
}

const Buttons = ({onHandleSubmit} : ButtonsProps) => {

  const accidentals = ['♯', '0', '♭'];
  
  const makeRow = (accidental : string) =>
  {
    let accidentalShift = (accidental === '♯') ? 1 : ((accidental === '0') ? 0 : -1); 
    return baseNotes.map((note)=>{
      return ( 
          <button 
            type="button" 
            onClick={() => onHandleSubmit(ensureBlendedIndexInRange(note.blendedIndex + accidentalShift))} 
            style={{width: '30px', height: '24px'}}
          >
              {accidental === '0' ? note.note : accidental}
          </button>
        );
    });
  }

  return (
    <div className={styles.buttonGrid}>
      {makeRow(accidentals[0])}
      {makeRow(accidentals[1])}
      {makeRow(accidentals[2])}
    </div>
  );
}

// TODO: REFACTOR INTO COMPONENT FILE
// TASK  ----------------------------------------------------------------------------------------------------------------------------------------

type TaskProps = {
  targetNote : number;
  interval : number;
}

const Task = ({targetNote, interval} : TaskProps) =>
{
  return (
    <div className={styles.task}>
      Major {intervals[interval]} 
      <br/>
      of {stringifyBlendedNote(blendedNotes[targetNote])}
    </div>
  );
}

// TODO: REFACTOR INTO COMPONENT FILE
// RESULTS  ----------------------------------------------------------------------------------------------------------------------------------------

type ResultsProps = {
  correctnessString : string,
  correctnessOpacity : string,
  score : number,
  totalAnswers: number
}

const Results = ({correctnessString, correctnessOpacity, score, totalAnswers} : ResultsProps) =>
{
  return (
    <div className={styles.results}>
      <span className={`${correctnessOpacity}`}>
        {correctnessString}
      </span>
      <br/>
      {score}/{totalAnswers}
    </div>
  )
}

export default App;
