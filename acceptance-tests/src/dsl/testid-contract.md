# Test id contract

Every `data-testid` the DSL relies on. This is the contract between the webapp and the acceptance tests: adding, renaming
or removing one means changing both sides in the same commit.

| Test id                           | Where                      | Meaning                                                                                                                    |
| --------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `app-ready`                       | app shell                  | Present once the app has mounted and loaded its saved state                                                                |
| `cards-due-today`                 | home screen, study summary | Number of cards due today across every deck, digits only                                                                   |
| `daily-goal`                      | home screen, study summary | The daily goal, in cards to review, digits only                                                                            |
| `cards-reviewed-today`            | home screen, study summary | How many different cards have been answered today, digits                                                                  |
| `daily-goal-met`                  | home screen, study summary | Present once today's goal has been reached                                                                                 |
| `open-struggling`                 | home screen                | Button: open the list of cards the learner keeps forgetting                                                                |
| `struggling-count`                | home screen                | Inside `open-struggling`: how many cards are on the list                                                                   |
| `deck-due-<deck id>`              | home screen, deck list     | Cards due today in that deck, within its own limits, digits only                                                           |
| `deck-new-<deck id>`              | home screen, deck list     | Of those, how many are new cards, digits only                                                                              |
| `deck-learning-<deck id>`         | home screen, deck list     | Of those, how many are being learned or relearned, digits only                                                             |
| `deck-review-<deck id>`           | home screen, deck list     | Of those, how many are coming back for review, digits only                                                                 |
| `study-only-new-<deck id>`        | home screen, deck list     | Button: study only that deck's new cards. Present only when that would be fewer cards than the whole session               |
| `study-only-struggling-<deck id>` | home screen, deck list     | Button: study only that deck's struggling cards. Present only when that would be fewer cards than the whole session        |
| `study-only-count-new-<deck id>`  | home screen, deck list     | Inside the button: how many cards it holds, digits only. `study-only-count-struggling-<deck id>` likewise                  |
| `look-ahead-<deck>`               | home screen                | Button on a deck row, shown only when cards wait for a later day: look at them without changing the schedule               |
| `look-ahead-count-<deck>`         | home screen                | Inside it: how many cards, digits only                                                                                     |
| `keep-offline-<deck>`             | home screen                | Button on a deck row, shown while some of its recordings are not on the device: keep them all                              |
| `offline-kept-<deck>`             | home screen                | Inside the deck row: how many of its recordings are on the device, digits only                                             |
| `offline-total-<deck>`            | home screen                | Inside the deck row: how many recordings the deck has, digits only                                                         |
| `offline-done-<deck>`             | home screen                | Shown instead of the button once every recording of the deck is on the device                                              |
| `start-reviewing-<deck id>`       | home screen, deck list     | Button that begins a session on that deck only                                                                             |
| `review-screen`                   | review screen              | Present while a session is on screen (cards or completion)                                                                 |
| `card-front`                      | review screen              | Text on the front of the current card                                                                                      |
| `card-back`                       | review screen              | Text on the back; present only once the answer is shown                                                                    |
| `show-answer`                     | review screen              | Button that reveals the back; absent once shown                                                                            |
| `preview-notice`                  | review screen              | Shown in a look ahead: says the answers are not kept                                                                       |
| `preview-next`                    | review screen              | Button shown in a look ahead in place of the ratings: move on without answering                                            |
| `rate-again`                      | review screen              | Rating buttons; present only once the answer is shown                                                                      |
| `rate-hard`                       | review screen              | (as above)                                                                                                                 |
| `rate-good`                       | review screen              | (as above)                                                                                                                 |
| `rate-easy`                       | review screen              | (as above)                                                                                                                 |
| `cards-remaining`                 | review screen              | Cards left in this session, digits only                                                                                    |
| `session-complete`                | review screen              | Present instead of a card when nothing is left to review                                                                   |
| `mark-hard`                       | review screen              | In the more options. Button: say this card is hard (replaced by `marked-hard` once it is on the list)                      |
| `marked-hard`                     | review screen              | In the more options. Shown instead of `mark-hard` while the card is on the Struggling list                                 |
| `note-add`                        | review screen              | In the more options. Button: write a note on this card (shown while the card has none)                                     |
| `note-input`                      | review screen              | In the more options. Text box for the note, after `note-add`                                                               |
| `note-save`                       | review screen              | In the more options. Button: keep the note                                                                                 |
| `note-text`                       | review screen              | On the card. The card's note, shown once it has one                                                                        |
| `note-remove`                     | review screen              | In the more options. Button: take the note off (shown while the card has one)                                              |
| `picture-input`                   | review screen              | In the more options. File input: choose a picture for this card                                                            |
| `picture`                         | review screen              | On the card. The card's picture (an image), shown once it has one                                                          |
| `picture-area`                    | review screen              | On the card. Present once the kept pictures have loaded, with or without a picture in it                                   |
| `picture-add`                     | review screen              | In the more options. Button: choose a picture for this card (shown while the card has none)                                |
| `more-options`                    | review screen              | Button: open the dialog holding the rarely used actions                                                                    |
| `more-options-dialog`             | review screen              | The dialog of rarely used actions: picture, note, hard, bury, suspend                                                      |
| `more-options-close`              | review screen              | Button in the dialog: close it                                                                                             |
| `picture-remove`                  | review screen              | In the more options. Button: take the picture off                                                                          |
| `picture-error`                   | review screen              | In the more options. Why a chosen or pasted file was refused                                                               |
| `fade-offer`                      | review screen              | Shown when the card's note or picture can fade: three good answers in a row since they were added                          |
| `fade-remove`                     | review screen              | Button in the offer: remove the note and picture                                                                           |
| `fade-keep`                       | review screen              | Button in the offer: keep them, and ask again after three more good answers                                                |
| `aid-prompt`                      | review screen              | Shown on a struggling card with no note or picture: asks the learner to add one                                            |
| `shape-similar`                   | review screen              | One per character the card warns it is easily mixed up with, e.g. `ツ tsu`; only once the answer is shown                  |
| `card-explanation`                | review screen              | Why this kana exists and when it is met (the rare foreign-sound katakana); only once the answer is shown, and on few cards |
| `review-struggling`               | review screen              | Button on the completion screen, shown when cards are struggling: open the list                                            |
| `struggling-notice-count`         | review screen              | Inside it: how many cards are struggling, digits only                                                                      |
| `finish-session`                  | review screen              | Button, shown with the completion message, back to home                                                                    |
| `leave-session`                   | review screen              | Button in the header, leaves the session early and goes home                                                               |
| `rate-<rating>-interval`          | review screen              | Inside each rating button: when the card returns, e.g. `10m`                                                               |
| `open-settings`                   | home screen                | Button that opens the settings screen                                                                                      |
| `settings-screen`                 | settings screen            | Present while the settings are on screen                                                                                   |
| `new-cards-per-day-<deck id>`     | settings screen            | Number field: new cards of that deck introduced each study day                                                             |
| `max-reviews-per-day-<deck id>`   | settings screen            | Number field: review cards of that deck done each study day. Disabled while the limits are locked                          |
| `limits-unlocked-<deck id>`       | settings screen            | Checkbox: let that deck's reviews per day be set apart from its new cards (locked, they are ten for each new card)         |
| `deck-voice-<deck id>-male`       | settings screen            | Radio: the voice that speaks that deck. `deck-voice-<deck id>-female` likewise                                             |
| `deck-speed-<deck id>-normal`     | settings screen            | Radio: the speed that deck is spoken at. `deck-speed-<deck id>-slower` likewise                                            |
| `daily-goal-input`                | settings screen            | Number field: the daily goal, in cards                                                                                     |
| `close-settings`                  | settings screen            | Button back to the home screen                                                                                             |
| `bury-card`                       | review screen              | In the more options. Button: hide this card until tomorrow                                                                 |
| `suspend-card`                    | review screen              | In the more options. Button: hide this card until it is brought back                                                       |
| `suspended-count`                 | settings screen            | How many cards are suspended, digits only                                                                                  |
| `unsuspend-all`                   | settings screen            | Button: bring every suspended card back                                                                                    |
| `replay-audio`                    | review screen              | Button: play the card's recording again                                                                                    |
| `card-front-hidden`               | review screen              | Inside `card-front` instead of the word, when listening only                                                               |
| `desired-retention`               | settings screen            | Number box: the percentage of reviewed cards the learner wants to remember (70 to 97)                                      |
| `theme-system`                    | settings screen            | Radio: the colours follow the device. `theme-light` and `theme-dark` likewise                                              |
| `voice-female`                    | settings screen            | Radio: the female voice when browsing. `voice-male` likewise                                                               |
| `speed-normal`                    | settings screen            | Radio: normal speed when browsing. `speed-slower` likewise                                                                 |
| `hide-target`                     | review screen              | In the more options. Checkbox: keep the target-language word off the front of the cards of this deck, when it comes first  |
| `release-update`                  | any screen                 | Notice that a new release is ready (compiled build only)                                                                   |
| `release-update-refresh`          | release notice             | Button: switch to the new release and reload                                                                               |
| `release-update-later`            | release notice             | Button: dismiss the notice until the next visit                                                                            |
| `similar-open`                    | review screen              | Button: open or close compare sounds; only once answer shown; `data-has-similars="true"` when a similar is there to hear   |
| `similar-panel`                   | review screen              | The panel itself, present while open                                                                                       |
| `similar-play-own`                | similar panel              | Button: play the card's own Korean word                                                                                    |
| `similar-row`                     | similar panel              | One similar: holds the next three                                                                                          |
| `similar-word`                    | similar row                | The similar's text                                                                                                         |
| `similar-play`                    | similar row                | Button: play the similar                                                                                                   |
| `similar-play-both`               | similar row                | Button: play the card's word, then the similar                                                                             |
| `similar-input`                   | similar panel              | Field: a word the learner mistakes this one for                                                                            |
| `similar-add`                     | similar panel              | Button: ask for it (disabled while fetching)                                                                               |
| `similar-error`                   | similar panel              | Why the word could not be added; absent when it could                                                                      |
| `switch-voice`                    | review screen              | Button: switch female/male and speak again; only for Korean                                                                |
| `switch-speed`                    | review screen              | Button: switch normal/slower and speak again; Korean only                                                                  |
| `account`                         | settings screen            | The account section, shown while signed in                                                                                 |
| `sign-in`                         | sign-in screen             | Button: sign in with Google                                                                                                |
| `signed-in`                       | settings screen            | Present while signed in                                                                                                    |
| `signed-in-email`                 | settings screen            | Inside `signed-in`: who is signed in                                                                                       |
| `sign-out`                        | settings screen            | Button: sign out                                                                                                           |
| `similar-switch-voice`            | similar panel              | Button: switch female/male and play the card's own word                                                                    |
| `similar-switch-speed`            | similar panel              | Button: switch normal/slower and play the card's own word                                                                  |
| `sync-status`                     | home                       | Whether this device matches what is kept online; `data-state` is `synced`, `syncing` or `not-synced`                       |
| `login-screen`                    | sign-in screen             | The sign-in screen: all there is until signed in                                                                           |
| `app-home`                        | home screen                | Present while the home screen is on screen                                                                                 |
| `app-title`                       | home and sign-in screens   | The app's name, as the heading at the top of either screen                                                                 |
| `open-browse`                     | home screen                | Button that opens the list of every card                                                                                   |
| `browse-screen`                   | browse screen              | Present while the list of cards is on screen                                                                               |
| `close-browse`                    | browse screen              | Button back to the home screen                                                                                             |
| `browse-search`                   | browse screen              | Field: narrows the list to cards containing the text                                                                       |
| `browse-deck-filter`              | browse screen              | Select: narrow the list to one deck, or `all` (the default) for every deck                                                 |
| `browse-count`                    | browse screen              | How many cards are listed, digits only                                                                                     |
| `browse-card`                     | browse screen              | One row; holds the next five                                                                                               |
| `browse-card-front`               | browse card                | The front text                                                                                                             |
| `browse-card-back`                | browse card                | The back text                                                                                                              |
| `browse-card-hint`                | browse card                | How the Korean is said in Latin letters                                                                                    |
| `browse-card-status`              | browse card                | New, Learning, Due, Due in 4d, Suspended or Buried                                                                         |
| `browse-card-struggling`          | browse card                | Present, inside the row, when the card is on the Struggling list                                                           |
| `romanisation-system`             | browse screen              | The line saying Korean words follow the Revised Romanization of Korean                                                     |
| `browse-card-play`                | browse card                | Button: play the card's Korean word                                                                                        |
| `browse-nothing-found`            | browse screen              | Shown when a search matches no card                                                                                        |
| `browse-switch-voice`             | browse screen              | Button: switch female/male (the one voice setting)                                                                         |
| `browse-switch-speed`             | browse screen              | Button: switch normal/slower                                                                                               |
| `browse-card-similars`            | browse card                | Button: open this word's similars panel; `data-has-similars="true"` when the word has a similar to hear                    |
| `similar-delete`                  | similar row                | Button: delete a similar the learner added                                                                                 |
| `new-card-word`                   | browse screen              | Field: the Korean word of a card of the learner's own                                                                      |
| `new-card-meaning`                | browse screen              | Field: its meaning in English                                                                                              |
| `new-card-romanisation`           | browse screen              | Field: how it is said, in Latin letters                                                                                    |
| `browse-add-card`                 | browse screen              | Button: make the card; absent when signed out                                                                              |
| `new-card-error`                  | browse screen              | Why the card was refused; absent when it was not                                                                           |
| `browse-card-delete`              | browse card                | Button: delete the learner's own card (not on deck cards)                                                                  |
| `browse-card-delete-confirm`      | browse card                | Button shown after the first press: really delete                                                                          |
| `browse-card-edit`                | browse card                | Button: edit the learner's own card (not on deck cards)                                                                    |
| `edit-card-word`                  | browse card                | Input in the edit form: the Korean word                                                                                    |
| `edit-card-meaning`               | browse card                | Input in the edit form: the English meaning                                                                                |
| `edit-card-romanisation`          | browse card                | Input in the edit form: how it is said                                                                                     |
| `browse-card-edit-save`           | browse card                | Button: save the edit (the form closes when it is saved)                                                                   |
| `browse-card-edit-cancel`         | browse card                | Button: close the edit form, changing nothing                                                                              |
| `edit-card-error`                 | browse card                | Why the edit was refused (absent when there is none)                                                                       |

## Struggling

| Test id                      | Where             | Meaning                                                           |
| ---------------------------- | ----------------- | ----------------------------------------------------------------- |
| `struggling-screen`          | struggling screen | Present while the list is on screen                               |
| `close-struggling`           | struggling screen | Button back to the home screen                                    |
| `struggling-card`            | struggling screen | One card on the list                                              |
| `struggling-card-front`      | struggling card   | The front text                                                    |
| `struggling-card-back`       | struggling card   | The back text                                                     |
| `struggling-card-lapses`     | struggling card   | How many times it was forgotten, digits only                      |
| `struggling-card-status`     | struggling card   | `Suspended` when set aside, else empty                            |
| `struggling-card-bring-back` | struggling card   | Button on a suspended card: bring it back into the reviews        |
| `struggling-empty`           | struggling screen | Shown instead of the list when no card is struggling              |
| `struggling-after`           | settings screen   | Number field: forgetting a card this many times makes it struggle |
| `set-aside-when-struggling`  | settings screen   | Checkbox: suspend a card as soon as it counts as struggling       |
