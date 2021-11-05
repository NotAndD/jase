import { toParagrapth } from '../models/Paragraph';

const jsonPars = [
    {
        "id": 0,
        "title": "Where the story begins..",
        "text": "Start by choosing which side of the story you want to explore..",
        "sons": [1]
    },
    {
      "id": 1,
      "title": "Hungry and poor",
      "text": "[p_name] sighed, opening [p_his_her] fridge.. only to take a look at the sad emptiness inside: an expired milk container.. and a lot of useless, cold air. Well, at least it was ordered and pretty clean, right?\n\nPatting [p_his_her] belly, which was hungrily gurgling, [p_he_she] tried to think if [p_he_she] had some money left for some food.. a question [p_he_she] already knew the answer of.. there was no money, sigh.\nThe [p_short_desc] stood up and sighed again.. [p_he_she] was soooo in mood for apples.. yet [p_he_she] didn't have money for even a single one.. truly the world was unfair..",
      "parents": [0],
      "sons": [
        2
      ]
    },
    {
      "id": 2,
      "title": "Go search for apples",
      "text": "The [p_short_desc] scratched [p_his_her] neck, thinking. Well, trying to think.. given how hungry [p_he_she] was feeling.. and then looked outside. It was sunny.. a sunny, warm day, the beautiful, peaceful landscape inviting [p_him_her] to get outside.\n\nUhm.. uh.. what if I.. go searching for some apples? Surely there are some apples outside.. in the world.. to be found, right?\nWith the idea strong in [p_his_her] mind, [p_name] moved to the door and stepped outside, greeted by the sun pouring warmness on [p_his_her] hungry body.",
      "parents": [1]
    }
  ]

export const PARAGRAPHS = jsonPars.map(p => toParagrapth(p));
