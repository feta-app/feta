# Feta

![Feta logo](public/feta-logo.png?raw=true "Logo")

### Find fresh, free food facilitated fully from Feta.

_**40% of all food in the United States goes to waste.**_ … but you’re still randomly hungry for literally anything at 11pm. What if there was an app that would let anyone share their free food tips across campuses, boardrooms, and cities?

**Feta** lets you do this, providing a way for socially-verifiable, live information concerning leftover free food to be shared by clubs, shops, restaurants, and individuals to the general community. No longer will people rely on non-transparent, confusing, and out-of-date GroupMes or word-of-mouth for price-free sustenance.

## What it does

Users submit geo-located posts with images describing an instance of free food. ML classifiers automatically tag posts with relevant info. Other users see the most relevant and closest posts both on a live map and a sidebar list, and can collectively decide if they are real or not. Over time, this will create a mutually-beneficial ecosystem based on algorithmical trust and, of course, late-night hunger.

## How we built it

Feta is currently a mobile-first web app using [Next.js](https://nextjs.org/)  and [Chakra UI](https://chakra-ui.com/) on the frontend, and [Convex](https://www.convex.dev/) (a serverless app platform) on our backend. We use Auth0 and Google Sign-in to authenticate users without burdensome and unsecure manual registration. The web app is hosted on Netlify.

## Features

* Web notifications to notify users of nearby free food.
* Graphical ratings system to dynamically boost good free food and eliminate fraud on the platform.
* Easy user authentication and account creation with 0Auth.
* Machine-learning classification models increase user ease-of-submission of new food items on the map.

## What's next for Feta

* SMS notifications to facilitate 24/7 connected snacking without having to check Feta regularly.
* More refined AI classification model using real-world collected data.
* Support for organizations (restaurants, food banks etc.) for recurring food events.
