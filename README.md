# Interval Running Timer

An eyes-free interval timer for run/walk training — you never have to look at your
phone to know which phase you're in.

**[Live demo](https://interval-running-timer.vercel.app)**

![Interval Running Timer counting down a run phase](https://github.com/user-attachments/assets/c65ae031-627f-415d-a00c-2a6b77f936c7)


## Why I Built This

I started running with my daughter in the mornings. She couldn't run the whole
distance yet, so we agreed to alternate — run a stretch, walk a stretch. The problem
was that neither of us wanted to keep checking a phone mid-run, and without checking
we had no idea how far into a phase we were.

I looked for an existing interval timer and couldn't find one that was simple, free,
and did just this. So I built one.

## What I Got Wrong the First Time

The first version played a sound only at each transition — one cue when the run
started, one when it ended.

It didn't work. My daughter would hear the cue, start running, and then stop a few
seconds later. When I told her the interval wasn't over, she'd ask "how much longer?"

The problem was that a transition-only cue tells you when something *changes* but
nothing about the state you're *in*. Silence was ambiguous: it could mean "still
running" or "you're done," and she had no way to tell them apart without looking at
the screen — which was the one thing the timer was supposed to avoid.

## The Redesign

We worked out the fix together:

- **During the run phase**, a low tone repeats once per second for the whole
  interval. The signal now means "keep going," and its *absence* is the cue to stop —
  one sound carries both messages.
- **In the last three seconds of the walk phase**, a higher tone counts down, so the
  next run arrives with a warning instead of as a surprise.
- We tested several pitches to find ones a child hears clearly outdoors without
  finding them harsh.

The real change was going from an *event* signal to a *state* signal. That removed
the "how much longer?" question entirely — the sound answers it continuously.

## Features

- Configurable run and walk durations
- Continuous audio cue through the run phase; a three-second warning before it starts
- Visual countdown for when you do want to look

## Tech Stack

- React
- Next.js
- Deployed on Vercel

## Run Locally

1. Clone the repository
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`
