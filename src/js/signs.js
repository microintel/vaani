// Sign catalogue: what each recognised key displays, types and how it is described.

export const SIGNS = {
  A:     { big: 'A',  name: 'Letter A',               text: 'A',            hint: 'Fist, thumb at side' },
  B:     { big: 'B',  name: 'Letter B',               text: 'B',            hint: 'Four fingers up, thumb in' },
  D:     { big: 'D',  name: 'Letter D / 1',           text: 'D',            hint: 'Index up, others curled' },
  F:     { big: 'F',  name: 'Letter F',               text: 'F',            hint: 'Thumb+index circle, 3 up' },
  I:     { big: 'I',  name: 'Letter I',               text: 'I',            hint: 'Pinky up' },
  L:     { big: 'L',  name: 'Letter L',               text: 'L',            hint: 'Thumb + index out' },
  O:     { big: 'O',  name: 'Letter O',               text: 'O',            hint: 'All fingertips circle' },
  U:     { big: 'U',  name: 'Letter U',               text: 'U',            hint: 'Index+middle together' },
  V:     { big: 'V',  name: 'Letter V',               text: 'V',            hint: 'Index+middle apart' },
  W:     { big: 'W',  name: 'Letter W',               text: 'W',            hint: 'Three fingers up' },
  Y:     { big: 'Y',  name: 'Letter Y',               text: 'Y',            hint: 'Thumb + pinky out' },
  HELLO: { big: '✋', name: 'Hello (open hand)',      text: ' HELLO ',      hint: 'All five fingers open' },
  GOOD:  { big: '👍', name: 'Good / Yes (thumbs up)', text: ' GOOD ',       hint: 'Fist, thumb up' },
  ILY:   { big: '🤟', name: 'I love you',             text: ' I LOVE YOU ', hint: 'Thumb, index, pinky out' },

  // ---- Two-hand signs ----
  PEACE:     { two: true, big: '✌️✌️', name: 'Peace',       text: ' PEACE ',     hint: 'Both hands V' },
  GREAT:     { two: true, big: '👍👍', name: 'Great',       text: ' GREAT ',     hint: 'Both thumbs up' },
  HEART:     { two: true, big: '🫶',   name: 'Heart',       text: ' HEART ',     hint: 'Fingertips and thumbs touch' },
  MORE:      { two: true, big: '👌',   name: 'More',        text: ' MORE ',      hint: 'Both hands pinched, tips touch' },
  TIMEOUT:   { two: true, big: '⏱️',   name: 'Time out',    text: ' TIME OUT ',  hint: 'Index on flat palm' },
  LOVE:      { two: true, big: '🤗',   name: 'Love',        text: ' LOVE ',      hint: 'Crossed fists' },
  PLEASE:    { two: true, big: '🙏',   name: 'Please',      text: ' PLEASE ',    hint: 'Palms pressed together' },
  CELEBRATE: { two: true, big: '🎉',   name: 'Celebrate',   text: ' CELEBRATE ', hint: 'Both open hands wide apart' }
};
