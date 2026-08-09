# Senior React Native Engineer: technical challenge

Thanks for making it to this stage. This challenge is different from the usual
take-home, so please read this page properly before you start.

We are not asking you to write an app. We are asking you to write the design spec
and implementation plan for one, and then to hand that to an agent and let it
build.

That is how our team actually works. A product brief becomes a spec, and
engineering, product and design review it. The approved spec becomes a plan, and
that gets reviewed too. Then we execute it with subagents and review the result
before merge. Writing the spec is the part of that loop where the thinking happens,
so it is the part we want to see you do.

## The app you're working with

This repo contains a small working React Native app called Activity Logger. A
member can log a fitness activity with a name, a duration in minutes and optional
notes. The app saves activities on the device and lists them.

Run it:

```bash
pnpm install
pnpm ios       # or: pnpm android, pnpm web
pnpm test
```

The app is real and it works. Spend a few minutes with it and read the source
before you start writing. It is about 700 lines across six files.

## The brief

This is what product has handed you.

> **Context.** Members tell us they lose track of whether they're doing enough
> exercise. They open the app, see a list of past activities, and can't tell
> whether this week is going well or badly.
>
> **What we want.** A member should be able to set a weekly exercise target and
> know whether they're on track, ahead, or falling behind.
>
> **How we'll know it worked.** A member can answer "am I on track this week?" in
> under two seconds, without tapping anything.

That is all we have. Anything the brief does not answer is yours to decide.

The success criterion is product's opinion, and nobody has validated it. If you
think it points at the wrong design, say so and design what you think is right.

## What to send us

Everything reaches us as **one pull request** in your own copy of this repo: the three
documents below, plus whatever the build produces, committed on a branch. The pull
request description is where you tell us about the run and anything else we should
know. Mechanics are in Submitting, at the bottom.

The three documents:

`GUARDRAILS.md` is the standards you want followed while this gets built. Whatever
you would tell an agent on day one, before it writes a line of code. This should
take you a couple of minutes, because it is what you already believe.

`SPEC.md` is the design. What gets built and why.

`PLAN.md` is how the work gets done.

Two things about the audience for these documents, because they change what needs
to be in them. First, an agent will implement them without supervision. Second, a
peer will review them before anything merges.

We are not going to tell you what to put in them beyond that. How you write a spec
is a large part of what we are assessing.

## What we are actually looking for

You will use AI for this. So do we, every day, and the challenge assumes it.

But we have already run this brief through a coding agent ourselves, several times,
with no human judgement added. We know what that produces: a competent spec, a
sensible plan, and a working feature. We keep those runs, and we can recognise one.

What an agent cannot give us is your opinion. Where you disagreed with the obvious
answer and why. What you decided not to build. Which trade-off you took and what it
cost you. The thing you noticed that nobody asked you to look for. The call you made
that you are not completely sure about, and what would change your mind.

If your submission reads like the default answer to this brief, that is the result
we will record. Put yourself in it.

## Then let your agent build it

Once your plan is written, hand it to your agent and let it execute. You do not
need to sit and watch. Commit whatever it produces.

**Write this up in the pull request description**, not in another file:

- How many times you had to step in, and what for
- Where the agent did something other than what you intended
- What you would change in the spec as a result
- Anything else you want us to know before we read it

Be honest about the intervention count. A low number with specifics tells us the
spec was doing real work. Nobody expects zero.

## Then look at it

Before you open the pull request, run the app and use it. Tell us in the description
which states you looked at, what you ran it on (simulator, device or web), and what
you found.

If something only shows up when you run it, that is exactly what we want to hear
about. If you did not run it, say so instead. We would rather know than guess.

## Time

Spend about two hours of your own time on this. Nearly all of that is thinking,
reading and deciding. The build itself is quick once the plan is good.

| Step | Roughly |
|------|---------|
| Reading the app | 20 minutes |
| `GUARDRAILS.md` | Minutes |
| `SPEC.md` | Up to an hour |
| `PLAN.md` | 30 minutes |
| Starting the build and writing your note | 10 minutes |

If you run out of time, say so in the pull request description and note what you would have
done next. We would much rather see that than a padded document.

## How we'll assess it

The three documents are what we are assessing. We read the code as evidence about
the spec, never for completeness or polish. A half built feature from a sharp spec
is a better result here than a finished one that needed twenty corrections.

We will review your pull request in writing and leave comments, the same way we
would for a colleague. Expect to be asked to respond to that feedback. Pushing back
on a comment you disagree with is a perfectly good response, and so is changing
your mind. We are more interested in how you handle the review than in whether you
got everything right first time.

After that we will book a follow up conversation to talk through your decisions.

## Submitting

1. Click **Use this template** at the top of this repo to make your own copy. You
   can make it private.
2. Work on a branch. Commit the three documents and the build to it.
3. Open a pull request from that branch against your own `main`. Do not merge it.
4. Put your notes about the run in the pull request description.
5. Add your interviewer as a collaborator so we can read and comment.

If you would rather not use GitHub, zip the repo and email it back instead, with your
notes about the run in the email body. Tell us if you take that option so we know to
expect it.

Anything unclear about the process, ask. Anything unclear about the brief is part
of the exercise, so make a call and write down the call you made.

Good luck.
