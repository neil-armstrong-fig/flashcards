# AGENTS.md: react

Components, nested by who uses them, following the locality rule in the root `AGENTS.md`. The same folder set recurses at
every level, and a folder only appears once something needs it:

```
src/react/
  App.tsx                         the shell: the store provider, and saved progress loaded once on start
  components/<thing>/<Thing>.tsx  components used by more than one page, or by the shell (app-shell/, speaker-icon/, similar-panel/, voice-switch/)
  routes/                         `Routes.ts` (the typed `ROUTES`) and `CreateAppRouter.tsx` (react-router, hash routes)
  audio/                          where state and sound meet, since `redux/` and `audio/` may not import each other: `hooks/` (one folder each: `use-card-audio/` speaks the card on screen
                                  when it or its side changes, `use-speak-*/`, `use-switch-*/`), `own-words/` (add or change a card or similar word: recordings are
                                  fetched between the redux checks and the redux write), `sync/`, `sign-out/`, `offline/`
  pages/<page>/<Page>.tsx         one folder per screen (home/, review/, browse/, settings/, login/)
  pages/shared/                   what two pages share that is not a component (`utils/FormatInterval.ts`); pages/ holds only pages and this
    components/<thing>/<Thing>.tsx
      components/                 components only <Thing> renders, each in its own folder
      hooks/<use-thing>/UseThing.ts   hooks only <Thing> calls
      <subject>/                  plain functions on one subject
      types/  utils/              utils/ is the last resort
```

**Anything shared by two siblings moves up to the folder that contains them both, and no higher.** A page is divided into
sections before it is divided into components, and the acceptance-test DSL mirrors the same names
(`acceptance-tests/src/dsl/web-app/components/{home,review}`): split or rename a section on one side and do the same on the other.
Naming a folder for its subject bites here in one way: Tailwind keeps presentation in the JSX, so a folder called `styles/`
reads as CSS and is almost always wrong.

## Conventions

- **Screens are routes.** `createAppRouter` maps `ROUTES` (a typed value, never a path written out) to pages inside `AppShell`, which lets
  the learner in (sign-in gate) and takes them to `/review` when a session starts. A link is `<Link to={ROUTES.x}>` and keeps its `data-testid`.
  A session is not kept between visits, so `/review` with none goes home (the route's loader).
- **Every component gets its own file in its own folder**, `components/<thing>/<Thing>.tsx`, however small and however few
  callers. This is the one place "declare functions below their callers" does not apply (that is for plain functions).
- **A component's props interface is called `Props` and is not exported.** A generic component constrains it against a named
  type, never an inline one.
- **A component reads what it draws from the store and dispatches what it does for itself. A setting that is not configurable is not a prop: `DailyGoalSetting` owns its label, test id and limits, and `NumberSetting` is only the view.** A page is layout, not a place to
  select a dozen values and thread them down. Where several siblings ask the same derived question, one hook answers it for
  them. Props carry only what the store does not hold: identity, and whatever differs from one instance of a repeated
  component to the next.
- **Every element an acceptance spec needs gets a `data-testid`.** That attribute is the contract with `acceptance-tests/`,
  listed in `acceptance-tests/src/dsl/testid-contract.md`. Add, rename or remove one in both places in the same change.
- **Two conditionals rather than a ternary** when choosing between JSX elements: `{flag && <A />}` then `{!flag && <B />}`.
  Never a ternary to choose a component.
- **A blank line between sibling JSX elements.** Prettier preserves these but never adds one, and no lint rule can: this is on
  you.
- **Mobile first, touch first.** Assume a small viewport. No negative margins: group a note with its neighbour in its own
  `flex flex-col` container with a tighter `gap-*`. Widen a tap target with an `after:` pseudo-element.
- **React owns the whole interactive page.** The HTML entry holds metadata and one root. Do not enhance markup with
  `querySelector` or add a second React root.
- **Words on screen are UK English.** Prefer a picture to a word where one will do; an icon-only control carries an
  `aria-label`.
- **Speaking is `react/audio/`'s job.** Components import its hooks and functions, never `audio/` directly for anything that
  needs state. `useCardAudio` is mounted once, by `ReviewPage`. A hook takes the voice and speed as an argument where a switch has only
  just changed them (`useSwitchVoice` hands the replay the new choice, not the one in its closure).
- **Keyboard shortcuts are a pure function and a thin hook.** What a key means is a plain function that is unit tested
  (`use-review-shortcuts/shortcut-for/ShortcutFor.ts`), and the hook only listens and dispatches. The keys: space
  shows the answer and then rates good, 1 to 4 rate, `-` buries, `@` suspends. Keys held with a modifier are left to the browser.
- **A control that would change what is saved waits for the save** (`RatingButtons` is disabled while `saving`), so a second
  tap cannot answer twice.
