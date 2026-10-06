import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {INITIAL_STUDY_STATE} from "@src/redux/slices/study/initial-state/InitialStudyState";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {nextStudyCard} from "@src/redux/slices/study/queue/NextStudyCard";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {IntervalPreview} from "@src/spaced-repetition/scheduling/types/IntervalPreview";
import type {QueueSettings} from "@src/spaced-repetition/queue/types/QueueSettings";
import type {ReviewOutcome} from "@src/spaced-repetition/scheduling/types/ReviewOutcome";
import type {SessionFocus} from "@src/redux/slices/study/types/SessionFocus";
import type {StoredStudy} from "@src/redux/slices/study/storage/types/StoredStudy";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

interface Loaded {
  readonly stored: StoredStudy;
  readonly deckOrder: readonly string[];
  readonly now: string;
}

interface CardsAdded {
  readonly ids: readonly string[];
  readonly now: string;
}

interface Answered {
  readonly previous: StudyCard;
  readonly outcome: ReviewOutcome;
  readonly now: string;
  readonly queueSettings: QueueSettings;
}

interface SetAside {
  readonly card: StudyCard;
  readonly now: string;
  readonly queueSettings: QueueSettings;
}

interface SessionStart {
  readonly deckId: string;
  readonly focus: SessionFocus;
  readonly now: string;
  readonly queueSettings: QueueSettings;
}

const studySlice = createSlice({
  name: "study",
  initialState: INITIAL_STUDY_STATE,
  reducers: {
    loaded: (state, action: PayloadAction<Loaded>) => {
      const {stored, deckOrder, now} = action.payload;
      const fresh = newCardState(new Date(now));

      state.cardOrder = [...deckOrder];
      state.cards = Object.fromEntries(deckOrder.map(id => [id, stored.cards[id] ?? fresh]));
      state.log = [...stored.log];
      state.now = now;
      state.status = "ready";
    },

    cardsAdded: (state, action: PayloadAction<CardsAdded>) => {
      const fresh = newCardState(new Date(action.payload.now));

      for (const id of action.payload.ids) {
        if (!state.cardOrder.includes(id)) {
          state.cardOrder.push(id);
          state.cards[id] = fresh;
        }
      }
    },

    cardsRemoved: (state, action: PayloadAction<readonly string[]>) => {
      const gone = new Set(action.payload);

      state.cardOrder = state.cardOrder.filter(id => !gone.has(id));
      state.cards = Object.fromEntries(Object.entries(state.cards).filter(([id]) => !gone.has(id)));

      if (state.session?.currentCardId && gone.has(state.session.currentCardId)) {
        state.session.currentCardId = undefined;
        state.session.answerShown = false;
        state.session.intervals = undefined;
      }
    },

    sessionStarted: (state, action: PayloadAction<SessionStart>) => {
      state.now = action.payload.now;
      state.session = {
        deckId: action.payload.deckId,
        focus: action.payload.focus,
        currentCardId: nextStudyCard(state, action.payload.deckId, action.payload.queueSettings, action.payload.focus)
          ?.id,
        answerShown: false,
        saving: false,
        previewed: [],
      };
    },

    savingStarted: state => {
      if (state.session) {
        state.session.saving = true;
      }
    },

    answerShown: (state, action: PayloadAction<IntervalPreview>) => {
      if (state.session) {
        state.session.answerShown = true;
        state.session.intervals = action.payload;
      }
    },

    answered: (state, action: PayloadAction<Answered>) => {
      const {previous, outcome, now, queueSettings} = action.payload;

      if (!state.session) {
        return;
      }

      state.cards[previous.id] = outcome.state;
      state.log.push(outcome.log);
      state.now = now;
      state.session.answerShown = false;
      state.session.intervals = undefined;
      state.session.saving = false;
      state.session.currentCardId = nextStudyCard(state, state.session.deckId, queueSettings, state.session.focus)?.id;
    },

    previewAdvanced: (state, action: PayloadAction<QueueSettings>) => {
      if (!state.session?.currentCardId) {
        return;
      }

      state.session.previewed = [...state.session.previewed, state.session.currentCardId];
      state.session.answerShown = false;
      state.session.intervals = undefined;
      state.session.currentCardId = nextStudyCard(state, state.session.deckId, action.payload, state.session.focus)?.id;
    },

    cardSetAside: (state, action: PayloadAction<SetAside>) => {
      const {card, now, queueSettings} = action.payload;

      if (!state.session) {
        return;
      }

      state.cards[card.id] = card.state;
      state.now = now;
      state.session.answerShown = false;
      state.session.intervals = undefined;
      state.session.saving = false;
      state.session.currentCardId = nextStudyCard(state, state.session.deckId, queueSettings, state.session.focus)?.id;
    },

    suspendedCardsRestored: (state, action: PayloadAction<Readonly<Record<string, CardState>>>) => {
      Object.assign(state.cards, action.payload);
    },

    cardMarkedHard: (state, action: PayloadAction<StudyCard>) => {
      state.cards[action.payload.id] = action.payload.state;
    },

    timePassed: (state, action: PayloadAction<string>) => {
      state.now = action.payload;
    },

    sessionEnded: state => {
      state.session = undefined;
    },
  },
});

export const {
  loaded,
  cardsAdded,
  cardsRemoved,
  sessionStarted,
  savingStarted,
  answerShown,
  answered,
  previewAdvanced,
  cardSetAside,
  suspendedCardsRestored,
  cardMarkedHard,
  timePassed,
  sessionEnded,
} = studySlice.actions;
export const studyReducer = studySlice.reducer;
