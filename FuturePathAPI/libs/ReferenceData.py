#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 08/05/2026
# Description: Reference data tables for d20 FuturePath character sheets

import logging

from FuturePathAPI.libs import DBConnection, loadYamlDBConfig

log = logging.getLogger("ReferenceData")

CHARACTER_PATHS = [
    {
        "Name": "Path of Strength (Strong Hero)",
        "Affinity": "Strength",
    },
    {
        "Name": "Path of Dexterity (Fast Hero)",
        "Affinity": "Dexterity",
    },
    {
        "Name": "Path of Constitution (Tough Hero)",
        "Affinity": "Constitution",
    },
    {
        "Name": "Path of Intelligence (Smart Hero)",
        "Affinity": "Intelligence",
    },
    {
        "Name": "Path of Wisdom (Dedicated Hero)",
        "Affinity": "Wisdom",
    },
    {
        "Name": "Path of Charisma (Charismatic Hero)",
        "Affinity": "Charisma",
    },
    {
        "Name": "Path of No Path (The Freelancer)",
    },
    {
        "Name": "Ovex Path (Fighter Module)",
    },
    {
        "Name": "Ovex Path (Leadership Module)",
    },
    {
        "Name": "Ovex Path (Specialist Module)",
        "Affinity": "Intelligence",
    },
    {
        "Name": "Ovex Path (Assistance Module)",
        "Affinity": "Wisdom",
    },
]

SPECIES = [
    "Human",
    "Volar",
    "Grayling",
    "Lepidonain",
    "Cryous",
    "Ovex",
    "Aconian",
    "Murid",
    "Avisari",
    "Khepri",
    "Sayor",
    "Kurgian",
    "Tygerion",
    "Xrototaxian",
    "Chronodes",
]

PROFESSIONS = [
    {
        "Name": "Combat Medic",
        "Affinity": ["Wisdom", "Dexterity"],
    },
    {
        "Name": "Dimension Knight",
        "Affinity": ["Strength", "Wisdom"],
    },
    {
        "Name": "Dreadnought",
        "Affinity": ["Dexterity", "Constitution"],
    },
    {
        "Name": "Engineer",
        "Affinity": ["Intelligence", "Constitution"],
    },
    {
        "Name": "Envoy",
        "Affinity": ["Charisma", "Wisdom"],
    },
    {
        "Name": "Electro-Mancer",
        "Affinity": ["Intelligence", "Dexterity"],
    },
    {
        "Name": "Field Officer",
        "Affinity": ["Charisma", "Wisdom"],
    },
    {
        "Name": "Helix Warrior",
        "Affinity": ["Strength", "Wisdom"],
    },
    {
        "Name": "Shield Splicer",
        "Affinity": ["Constitution", "Wisdom"],
    },
    {
        "Name": "Space Marine",
        "Affinity": ["Dexterity", "Strength"],
    },
    {
        "Name": "Starfighter",
        "Affinity": ["Dexterity", "Charisma"],
    },
    {
        "Name": "Swindler",
        "Affinity": ["Charisma", "Dexterity"],
    },
    {
        "Name": "Technosavant",
        "Affinity": ["Intelligence", "Wisdom"],
    },
    {
        "Name": "Tracer",
        "Affinity": ["Wisdom", "Intelligence"],
    },
    {
        "Name": "Xenophile",
        "Affinity": ["Wisdom", "Charisma"],
    },
]

OCCUPATIONS = [
    "Academic",
    "Adventurer",
    "Athlete",
    "Blue Collar",
    "Celebrity",
    "Creative",
    "Criminal",
    "Cyber-Specialist",
    "Dilettante",
    "Diplomat",
    "Doctor",
    "Emergency Services",
    "Entrepreneur",
    "Jobless",
    "Investigative",
    "Law Enforcement",
    "Mercenary",
    "Military",
    "Pioneer",
    "Religious",
    "Rural",
    "Student",
    "Spacer",
    "Technician",
    "White Collar",
]

ADVANTAGE_DIE_LEVELS = [
    "d2",
    "d2+1",
    "d2+2",
    "d4+2",
    "d4+3",
    "d4+4",
    "d6+4",
    "d6+5",
    "d6+6",
    "d8+6",
    "d8+7",
    "d8+8",
    "d10+8",
    "d10+9",
    "d10+10",
    "d12+10",
    "d12+11",
    "d12+12",
    "2d6+13",
    "2d6+14",
]

SKILL_DIE_LEVELS = [
    "d2",
    "2d2",
    "2d2+1",
    "d4+d2+1",
    "2d4+1",
    "2d4+2",
    "d6+d4+2",
    "2d6+2",
    "2d6+3",
    "d8+d6+3",
    "2d8+3",
    "2d8+4",
    "d10+d8+4",
    "2d10+4",
    "2d10+5",
    "d12+d10+5",
    "2d12+5",
    "2d12+6",
    "2d6+d12+7",
    "4d6+8",
]

SIZES = [
    "Fine",
    "Diminutive",
    "Tiny",
    "Small",
    "Medium",
    "Large",
    "Huge",
    "Gargantuan",
    "Colossal",
]

QUIRKS = [
    {
        "Name": "Absent-Minded",
        "Description": "The character often forgets important information, especially if recently learned.",
        "Penalty": "They take a disadvantage on all Intelligence-based ability and skill checks when attempting to recall information they have learned in their past. Normally, if a Character has just learned something during the game session, the Character can recall this information; however, in this case, the Character must make an Intelligence check to see if they can recall information. This includes Knowledge-based skill checks to remember things they have learned in their past.",
        "Overcome": "The Player can roll play having their Character go through mental exercises to learn to become less Absent-Minded. And/or, the Character through leveling must gain +3 to their Intelligence Theme Score or +2 to Intelligence and +1 to Wisdom Theme Score.",
    },
    {
        "Name": "Allergy",
        "Description": "Choose something the Character is allergic to. The concept here would be that either the type of allergy is rare or that the Character's body reaction is rare enough that most modern cures are not permanent or even completely ineffective.",
        "Penalty": "The chosen allergy is treated as a poison. Poison Save: Constitution DC 10 + 1 per every 6 minutes of continuous exposure. The onset is 1 minute of contact; Frequency: every 6 minutes another roll. 1d2 Con damage; Cure: 2 consecutive saves.",
        "Overcome": "There is no easy way to deal with Allergy. Most allergies will have medicine that removes the effect, but the Character will have to have taken it. Perhaps the Character or another Character in the party can discover and craft a new treatment. This would require knowledge and/or professional checks as well as crafting checks, and the effectiveness would be based on those rolls.",
    },
    {
        "Name": "Amnesia",
        "Description": "The character cannot remember his/her personal history. The Player must decide to what extent. For example, everything from more than 1 year in the past is a blank. Or only a couple of years chunk in the middle of the Character's life.",
        "Penalty": "The afflicted hero cannot use any prior contacts and takes a Major -4 penalty to all social skills.",
        "Overcome": "A variety of solutions. From the knowledge slowly coming back over time, to the Character getting visited by a ghost of the past and sent on a side quest, visiting a doctor/shrink and taking medicine or a cybernetic implant that unlocks the memories. As long as the GM and Player discuss before the game and agree which path the Character will take.",
    },
    {
        "Name": "Amorous",
        "Description": "The Character has difficulty holding themselves back from sexual desires. This mostly can cause the Character to get easily distracted and more likely to do actions like flirt or otherwise pursue sex. The target of these affections is based on the Character's sexual preference.",
        "Penalty": "Heroes with this difficulty suffer disadvantages to social skills or mind-affecting abilities from or to the Character's sexual preference. If an enemy of that preference is targeting that Character, this would imply that they get advantage.",
        "Overcome": "Self-control and mindfulness exercises are perhaps a possible solution. The Player could present different actions the Character can take as they level up to attempt to overcome this flaw, if they even wanted to.",
    },
    {
        "Name": "Anger Management",
        "Description": "The character is aggressive and loses his/her temper easily.",
        "Penalty": "He takes a disadvantage on Diplomacy skill checks. After any failed social skill check, the Character must make a Wisdom save DC 10 + (the difference in the failed check). If the save fails, the Character acts enraged and/or confused 1/min * the number the save failed.",
        "Overcome": "The Player should present different options to the GM/Group as to how the Character will learn to overcome this flaw if they want to. Options could include simply adding a preset number of points to Wisdom and/or declaring that the character goes to therapy between sessions and perhaps add that into the story somehow.",
    },
    {
        "Name": "Bad Luck",
        "Description": "The Character is just gosh darn always in the worst of it. Things seem to never go their way, and if it does, they have to work harder than everyone else, it seems.",
        "Penalty": "If the Character succeeds a roll by rolling the minimal amount necessary to achieve the success, they must re-roll again and take the lower of the two numbers. This is limited to skill checks and saving throws, with the exclusion of Con saves for death.",
        "Overcome": "If the Player wishes to have their flaw eventually overcome, they should provide an explanation, whether it be supernatural, weird-science, or just plain 'the character is a klutz/glutton for punishment.' Then the Player needs to explain how the Character can overcome this with the GM and come to an agreement before the game.",
    },
    {
        "Name": "Broke",
        "Description": "The Character is horrible at managing money. They are terribly poor, and even when the Character gets a hold of some sweat ISK, they seem to lose it quickly. This can either be played out in roleplaying where the Player has the Character waste money or simply in between sessions.",
        "Penalty": "The character's starting Wealth is decreased by 3/4. This can affect their starting items even if the Player selects a Starter Pack.",
        "Overcome": "The Player and/or GM must come up with an option for how the Character gets out of this issue.",
    },
    {
        "Name": "Combat Paralysis",
        "Description": "A form of PTSD involving conflict. The Player must determine whether it is a form of violence or specifically melee or weapon violence.",
        "Penalty": "If the Character enters into a combat situation where ANY combatants that the Character is aware of are using the specific type of violence the Character's Flaw is associated with, the Character must make a Wisdom save (DC 15 + number of opponents) in order to enter combat. They can still attempt to flee and are not considered flat-footed. They simply cannot bring themselves to fight. Every round of combat, the Character can attempt to join the DC again; the DC is reduced by 1 per round.",
        "Overcome": "The DC for this goes down by 1 for every two Character levels. At level 20, they no longer have this. If the Player doesn't want to wait that long, they can attempt to roleplay overcoming this. The Player/GM must come up with possible solutions before game.",
    },
    {
        "Name": "Coward",
        "Description": "The Character is a complete coward and is terrified of doing anything risky, especially if the risk directly affects his/her's well-being.",
        "Penalty": "The Character cannot put Skill Ranks into Intimidate until this is overcome. Anytime the Character is faced with danger, he/she must make a Wisdom save (fear effect) DC 15 + (the total hit dice of the opponents). If the save fails, the Character gets a Fear condition based on how badly the saving check failed. If the Character failed by only 1, then he/she is merely Frightened. If the Character failed by 2 to 5 then he/she is Cowering. If the Character fails by more than 5 then he/she is Panicked. In non-combat situations, other players can aid the coward to help them temporarily overcome their fears.",
        "Overcome": "As the Character levels up they have faced their fears and the base DC is reduced by 1 per 2 levels. They are no longer cowardly at level 20. This is optional. If the Player doesn't wish to wait that long, they or the GM can plan for the Player to roleplay the Character overcoming their fears step by step until the DC is below 5.",
    },
    {
        "Name": "Crude",
        "Description": "The Character doesn't have much in the way of words. The Character may be harsh, brash, and downright mean without thinking about it. They just constantly come off that way.",
        "Penalty": "The Character is given a disadvantage with Diplomacy checks as well as generic Charisma-based checks.",
        "Overcome": "If they choose, the Player/GM may roleplay over time the Character becoming more and more aware of their own flaw and how it negatively affects their goal and thus makes steps to correct it.",
    },
    {
        "Name": "Curious",
        "Description": "The Character is curious to a fault. Often ending them up in the wrong end of a gun or just in unfortunate circumstances.",
        "Penalty": "The Character is easily distracted. A disadvantage to perception checks unless the Player/GM determines that something that would fascinate the Character is perceptible; then that is the only thing they see.",
        "Overcome": "The Player/GM should present possible roleplaying solutions that can over time allow the Character to remove this quirk.",
    },
    {
        "Name": "Cybernetic Prejudice",
        "Description": "In the universe of Future Path, most societies frown on cybernetic implants for anything other than medical applications. The more cybernetic implants, the more likely people are to distrust, shun, or even hate the Character.",
        "Penalty": "Most any NPC that notices the Character has enhancing cybernetics will distrust or even hate the Character. The Character instantly suffers a disadvantage on Charismatic checks/skills. This increases to 2 and again to 3 disadvantages depending on how many cybernetic enhancements are visible. Perception/scanner check DC 15 + Tech Level to hide implants.",
        "Overcome": "There is no overcoming this unless all implants are removed. And even then, people who knew the Character had implants may not believe the Character without definite proof.",
    },
    {
        "Name": "Dark Secret",
        "Description": "The Character suffers from something detrimental in his/her past. It haunts them and causes them to act irrationally if confronted with it. They may attempt to ignore discussions or feign ignorance, or go out of their way to avoid it.",
        "Penalty": "Every time the Character gains a level after level 2, the Player must make a Charisma check (DC 7 + Character level), or else the Character's dark secret is let out to the party members.",
        "Overcome": "The Character can deal with and come to terms with their past, hopefully before the secret is revealed.",
    },
    {
        "Name": "Dull Senses",
        "Description": "The Character's senses are reduced. External stimuli don't have the same effect as they would for other members of the same species. This can be caused either by a genetic problem or a mental problem.",
        "Penalty": "The Character Passive Perception cannot gain a bonus from Wisdom. The Character's initiative is reduced by -1 unless it is already 0.",
        "Overcome": "Depending on the source of this flaw, the Player/GM has different choices as to how to roleplay the Character's recovery.",
    },
    {
        "Name": "Enigmatic Humor",
        "Description": "Nobody laughs at your jokes, and you often tell them at the most inappropriate times. You find it difficult to have a serious conversation with people.",
        "Penalty": "-1 to Diplomacy/Intimidate/Bluff plus another -1 per 5 levels.",
        "Overcome": "This one is difficult to overcome as it is a behavior modification. The Player and GM should agree on some means at which the Character can try to learn to control what comes out of their mouth. Perhaps gaining wisdom could count toward this.",
    },
    {
        "Name": "Family Troubles",
        "Description": "Something dark or simply just annoying lurks within your family tree. Either it is as silly as an annoying uncle that always wants to crash at the Character's place, or something darker, such as the Family being tied to organized crime.",
        "Penalty": "This penalty is up to the GM and depends on the source of the Quirk.",
        "Overcome": "The Character must go on a side quest or quests that resolve their family problems.",
    },
    {
        "Name": "Groupie",
        "Description": "Obsessed with a group, usually a band (like The Stage Droids), and shapes their life around the group's activities.",
        "Penalty": "Roleplaying specific penalty. Must try to always be where the band is. If not within 4 hours of the group, they become agitated and distracted. Must roll a Wisdom save DC 10 + 1 every 4 hours away; failure forces them to rush back.",
        "Overcome": "Psychological and behavioral. Spend time getting used to being away from the group, succeeding on saves every 4 hours until the DC is 30, or other creative solutions agreed upon by GM and Player.",
    },
    {
        "Name": "Hunted",
        "Description": "Characters with this Difficulty have someone (or something) after them, to do them harm.",
        "Penalty": "Every time the Character gains a level after level 2, he/she must make a Survival check (DC 7 + 1 per level + 1 per consecutive level not caught) to see if the hunter has found them.",
        "Overcome": "The Player/GM must agree on who and why the Character is being hunted. Then the Character must face these people on the Character's own terms to resolve the flaw.",
    },
    {
        "Name": "Illiterate",
        "Description": "This unfortunate hero cannot read or write.",
        "Penalty": "Cannot use a skill check or ability that requires reading or writing. All checks that involve this activity automatically fail.",
        "Overcome": "The Player/GM must allow time for the Character in between sessions to learn. If the story doesn't allow for downtime, knowledge injection using advanced technology may be required.",
    },
    {
        "Name": "Infamy",
        "Description": "The character is known in certain parts of the galaxy in a very negative way. This popular dislike may be well deserved or part of an unfortunate misunderstanding.",
        "Penalty": "If they enter any of those parts, they get a Major -2 per 5 Character levels to all Charisma-related skills except for the Intimidate skill.",
        "Overcome": "The Player must integrate this infamy into the backstory of the Character and through that determine if and how the Character can try to overcome this flaw.",
    },
    {
        "Name": "Jocund",
        "Description": "The Character is overly positive and jolly. They cannot help but express joy even if it hurts them inside, failing to convey other emotions.",
        "Penalty": "The Character takes a -1 (plus -1 every 5 Character levels) to Bluff and Intimidate. However, other people find it hard to sense the motives of this Character and roll disadvantages when doing so.",
        "Overcome": "Depending on the source (psychological, species, cybernetic), the Player/GM should figure out the course of action to remove this if desired.",
    },
    {
        "Name": "Kleptomaniac",
        "Description": "The character just cannot seem to keep his hands off other people's stuff, whether ashamed, proud, or indifferent.",
        "Penalty": "Must make a Wisdom save (DC 10 + 1 per day of not stealing) each day. If the save fails, the character must try to steal something of value that day.",
        "Overcome": "The Player can declare that during downtime the Character seeks help. Other Characters or NPCs may use Study/Profession and Long Term care skills to find a variety of treatments.",
    },
    {
        "Name": "Klutz",
        "Description": "The Character cannot help but bump into things, especially if breakable. Objects slip from their hands more often than normal.",
        "Penalty": "The character takes a -2 per 5 Character levels penalty on Dexterity-based ability and skill checks that are non-combat related.",
        "Overcome": "Decide the source first, then resolve by improving Dexterity by 3 or 4 points or through roleplay.",
    },
    {
        "Name": "Lazy",
        "Description": "Characters with this difficulty have a big book of excuses, so they are not inclined to do anything productive or contributory at all.",
        "Penalty": "The Player should role-play this Character as being difficult to work with. They gain -2 negative penalties to Craft/Study/Profession skill checks.",
        "Overcome": "Can be overcome through an intervention by peers or other agreed roleplaying methods.",
    },
    {
        "Name": "Liar",
        "Description": "The Character suffers from being a compulsive liar. They struggle to tell the truth, especially if it makes them look bad.",
        "Penalty": "Character takes a -2 per 5 levels penalty on Diplomacy skill checks.",
        "Overcome": "Psychological flaw/quirk. Options include seeking therapy during downtime or having another Character use skills to find a cure.",
    },
    {
        "Name": "Lightweight",
        "Description": "The Character is unusually lightweight due to a physical ailment or unusual phenomenon.",
        "Penalty": "The Character can only carry 1/2 the weight in items. The Character can be thrown back at twice the normal distance when being tossed or shoved in combat.",
        "Overcome": "Increase both Strength and Constitution attributes by an agreed amount.",
    },
    {
        "Name": "Nocturnal",
        "Description": "Sleeps during the day and rises at night, finding it hard to act during the day.",
        "Penalty": "Takes -1 per 5 levels starting at level 1 in Crafting, Study, or Profession skill checks when done during the day.",
        "Overcome": "Forcing the Character to perform actions during the day enough times to adjust sleeping patterns.",
    },
    {
        "Name": "Obsessed",
        "Description": "The Character cannot stop thinking about something and/or someone.",
        "Penalty": "Each day, must make a Wisdom save (DC 10 + 1 for each day away from object). Failure forces character to focus on reaching object; suffers Shaken condition until found or save passed.",
        "Overcome": "Forcing the Character to put skill points into Wisdom to show growing out of the obsession.",
    },
    {
        "Name": "Paranoid",
        "Description": "The character believes, irrationally, that something or someone is out to get him or her.",
        "Penalty": "Every day must make a Wisdom save (DC 10 + 1 per day without fit). Failure triggers Frightened, worsening on subsequent fail days to Cowering, then Panicked.",
        "Overcome": "Psychological condition; decide source and possible solutions before gameplay.",
    },
    {
        "Name": "Phobia",
        "Description": "Terrified of a specific person, action, idea, object, etc.",
        "Penalty": "Encountering fear object requires Wisdom save (DC 10 + 1/level; in combat DC 5 + 1/2 level) or become Panicked until object unobserved for 1 min. Fail by >3 in combat = Cowering, else Frightened.",
        "Overcome": "Psychological fear effect; treat accordingly through exposure or therapy.",
    },
    {
        "Name": "Physically Scared",
        "Description": "The Character is hideous to the average citizen of the Ring.",
        "Penalty": "The Character must lose 3 Charisma points until this is removed.",
        "Overcome": "Every point spent on Charisma in turn removes a point from this Quirk.",
    },
    {
        "Name": "Socially Awkward",
        "Description": "Socially awkward; struggles to carry conversations or detests social gatherings.",
        "Penalty": "Disadvantage to Charisma saving throws while not in combat. Also, a -1 penalty to Diplomacy with an additional -1 per 5 levels.",
        "Overcome": "Taking social skills lessons on Character downtime.",
    },
    {
        "Name": "Substance Addiction",
        "Description": "Addicted to a chemical drug. Must consume substance every 24 hours. Starting wealth reduced by 1/4.",
        "Penalty": "25th hour starts hourly WIS save (DC 5 + 1/hr without). Failure advances through 8 withdrawal stages: Frightened -> Cowering -> Panicked -> Fatigued -> Exhausted -> Nauseated -> Sickened/Helpless -> Death (Stage 8 requires hourly CON check DC 7 + 1/hr to survive 24 hrs).",
        "Overcome": "Survive physical withdrawal + 24-hr mental panic phase without relapsing, plus level up at least once and seek professional/party help or craft treatments.",
    },
    {
        "Name": "Repugnant",
        "Description": "There is something repulsive about the Character (smell, appearance, or mannerisms).",
        "Penalty": "-1 for every 5 levels, starting at level 0, in Diplomacy or non-combat Charisma-based checks.",
        "Overcome": "Behavioral or physiological changes, interventions, or grooming adjustments.",
    },
    {
        "Name": "Weak Stomach",
        "Description": "The Character often gets belly aches or a 'stomach bug' even when others eating the same food do not.",
        "Penalty": "Suffers -1 plus -1 for every 5 Character levels to Constitution saves involving ingested substances.",
        "Overcome": "Gene modification, diet medication, or medical treatment.",
    },
]

DETRACTORS = [
    {
        "Name": "Ability Reduction",
        "Description": "Gain a reduction to a specific Ability. An example of Ability Reduction would be 'Ability Reduction (Strength) x2'. This implies that the Strength Score is reduced by 2. This cannot be used to reduce something below a total score of 7.",
        "Requirements": "In order to count towards an Advanced Difficulty the Score needs to be reduced by 2.",
    },
    {
        "Name": "Ability Cap",
        "Description": "This is a cap on the max score of an Ability. An example would be 'Ability Cap (Dexterity) 12'. This implies that the Character can only have a max of 12 for their Dexterity score. When given if the Character has more than 12 they lose the extra points. If given as part of Character creation the Character can move the points around. If taken more than once for the same Ability then whatever the lower score counts and the other Ability Cap is removed. The Cap cannot be lower than 10.",
        "Requirements": "Must be taken before level 12. Cannot use this towards an Advanced Difficulty if the Score is already 18 or above.",
    },
    {
        "Name": "Skill Deficiency",
        "Description": "This causes a negative modifier to be applied to the Skill in question. An example would be 'Skill Deficiency (Disguise) -4'. This would imply that the Character has a minus 4 whenever they attempt to use the skill Disguise.",
        "Requirements": "This needs to be a minimum of -3 to count towards an Advanced Difficulty. Needs to be a Skill that the Character has Ranks in. Cannot use this on Crafting, Language, any Knowledge Skills.",
    },
    {
        "Name": "Skill Rank Cap",
        "Description": "This causes a cap on the max Skill Rank of a particular skill. An example would be 'Skill Rank Cap (Knowledge - Culture) 3'. This would imply that the Knowledge - Culture skill can never exceed the Rank of 3.",
        "Requirements": "Must be taken by level 10. Needs to be a Skill that the Character has Ranks in. Cannot use this on Crafting, Language, any Knowledge Skills.",
    },
    {
        "Name": "Skill Growth",
        "Description": "Here the number of provided skill points is reduced by 1 for every time the Character gets this Detractor. IE: 'Skill Growth x3' would mean the Character gets -3 skill points per level. This cannot be given if the Character is already down to zero. Even if the Character is at Zero skill points can be awarded by other means. Zero also means that the Character only gets Skill Points at every Odd level. Skill Points that are awarded at Character level 1 as part of Character creation are not affected by Skill Growth.",
        "Requirements": "Can only be taken once. From level 1-5 this is an x1. From level 6-10 this must be x2 or it won't count towards an Advanced Difficulty. From 11-15 must be x3 or won't count towards an Advanced Difficulty. Cannot be taken after level 15.",
    },
    {
        "Name": "Proficiency Trees",
        "Description": "Technologically Illiterate: The Character cannot improve their existing Technology score in the Proficiency Tree. Melee/Ranged/Armor Branch: The Character has to spend 2 points instead of 1 for every level beyond level 2 in the Melee/Ranged Branches or Armor Branch. Power Armor: The Character finds wearing Power Armor difficult. Each Rank costs 2 points instead of 1.",
        "Requirements": "This can only be picked once. Has to be taken by level 10.",
    },
    {
        "Name": "Languages",
        "Description": "The Character finds it harder than normal to learn new languages. Language skill is not considered Natural to them. All learned Language skill slots require two points to advance instead of one. (Not counting the initial skill rank)",
        "Requirements": "Can only be taken once. Has to be taken by level 10.",
    },
    {
        "Name": "XP Sink",
        "Description": "The Character gains less XP than other Characters do. This goes by increments of 5%. IE: (XP Sink 10%) would imply that each time XP is rewarded out to this Character they take 10% less. This doesn't mean that XP is divided up unevenly between Characters. If there is a reward of 400 XP and there are 4 players each gets 25% of the XP and the Character with the 'XP Sink 10%' simply earns 90XP while all others earn 100.",
        "Requirements": "This behaves similar to Skill Growth. Every 5 levels the minimum requirement for this to count towards an Advanced Difficulty this increases by 5%. So from level 1-5 this is 5% to count. If a Character is level 6-10 and they take this difficulty they have to start at 10% and goes by increments of 10% and so on.",
    },
    {
        "Name": "Techniques",
        "Description": "This only applies to Characters that can use Class specific Techniques. The Character can only know and use Techniques as if they are 1 level lower. This can only be applied once.",
        "Requirements": "Can only be taken once.",
    },
    {
        "Name": "Hit-Points Reduction",
        "Description": "This reduces the amount a Character gets per level. Each time this is applied the Character gets 1 less HP per level. An example would be 'HP Reduction x2' This would imply each level the Character gets 2 less HP. This cannot be applied more than 5 times. This cannot cause a Character to gain at less than 2 HP per level. This is applied retroactive starting at level 2.",
        "Requirements": "None",
    },
    {
        "Name": "Damage Sensitivity",
        "Description": "The Character has become weakened to a particular damage type. Learn about damage types and attributes here. This acts like Weakness rules for Damage Types.",
        "Requirements": "Can only be taken twice.",
    },
    {
        "Name": "Feat Blocking",
        "Description": "The Character is restricted from being able to apply a particular Feat.",
        "Requirements": "Has to be a Feat that the Character can be eligible for. This can not be applied to the following Categories: Specialty Skills, Difficulties, Skill Enhancements, Misc Feats.",
    },
]

MUTATION_DRAWBACKS = [
    {
        "Name": "Ability Decay",
        "Description": "Your body or mind suffers from some marked deformity or deterioration.",
        "MPValue": 5,
        "Drawback": "One of your ability scores (your choice) permanently decreases by 2. You cannot apply this drawback to an ability score of 5 or less.",
        "Special": "You may take this drawback multiple times. Its effects stack.",
    },
    {
        "Name": "Blood Hunger",
        "Description": "You crave the taste of blood. Moreover, you need to drink blood to survive.",
        "MPValue": 4,
        "Drawback": "You must drain a pint of blood from a living creature once every 24 hours. Doing so is an attack action, and you can only drain blood from a willing, helpless, or dying (but not dead) creature. The bitten creature takes normal damage from the bite attack plus an extra 1d6 points of damage from the blood loss.\n\nIf you go 24 hours without consuming blood, you take 1d4 points of Constitution damage. Drinking a pint of blood cures the damage caused by blood deprivation in 1d6 rounds. Ability damage caused by blood deprivation cannot be restored through natural healing.",
        "Special": "You must have a natural bite attack to take this drawback.",
    },
    {
        "Name": "Brittle Bones",
        "Description": "Your bones weaken such that you can no longer withstand hard or sudden impacts.",
        "MPValue": 2,
        "Drawback": "Your massive damage threshold decreases to 1/4 damage. In addition, you take an additional 1d6 points of damage from a fall per 10ft. Take disadvantage on all saving throws associated with the Shaken condition.",
        "Special": "You cannot take this drawback if you have the Exoskeleton or Skeletal Reinforcement mutation.",
    },
    {
        "Name": "Combat Fear",
        "Description": "Due to a chemical imbalance in your brain, you are gripped by an inexplicable fear whenever you face a dangerous or frightening situation.",
        "MPValue": 4,
        "Drawback": "After initiative is rolled but before you take your first action in combat, make a Will saving throw (DC 15). If you fail the Will save, you are shaken for the rest of the encounter, taking a -2 penalty on attack rolls, saving throws, and skill checks. If the save succeeds, you overcome your moment of fear and negate the ill effects.",
    },
    {
        "Name": "Festering Sores",
        "Description": "Your skin is covered with painful, festering sores.",
        "MPValue": 4,
        "Drawback": "The festering sores are more aggravating than harmful, but they make it especially hard to wear armor. Armor requirements all have +1 to Armor Branch. -2 to all Disguise Checks.",
    },
    {
        "Name": "Frailty",
        "Description": "Your body is particularly vulnerable to being hurt and cannot take as much damage as a normal person of the same species.",
        "MPValue": 3,
        "Drawback": "Gain Hit Points Reduction x1. This is applied retroactively.",
        "Special": "Can take this up to 1/2 the character's Hit Die Total. I.e., if the Character's Hit Die is 1d8, then this can be taken up to 4 times.",
    },
    {
        "Name": "Heat/Cold Susceptibility",
        "Description": "Your body does not react well to extreme heat or cold.",
        "MPValue": 1,
        "Drawback": "You gain Weakness 1 Thermal (Heat/Cold) (Excludes Radiation).",
        "Special": "This can be taken up to 10 times.",
    },
    {
        "Name": "Insanity",
        "Description": "Your mind is easily twisted and confused. You often find it difficult to separate fantasy from reality.",
        "MPValue": 5,
        "Drawback": "Every day your character flips a coin. If it is a 2 (or if the Player wins the coin toss), the Character can act normally. Otherwise, the Character gains disadvantage on all rolls.",
    },
    {
        "Name": "Lethargy",
        "Description": "Thanks to slow electrical impulses along your central nervous system, you have trouble reacting quickly to danger.",
        "MPValue": 4,
        "Drawback": "You take a disadvantage on Dexterity saves and Initiative Checks.",
        "Special": "You cannot take this mutation if you have the Lightning Reflexes feat.",
    },
    {
        "Name": "Light Sensitivity",
        "Description": "Your eyes cannot adjust to bright light.",
        "MPValue": 1,
        "Drawback": "Abrupt exposure to bright light (such as sunlight) blinds you for 1 round. On subsequent rounds, you take disadvantage on Attack Rolls, Perception checks as long as you remain in the affected area.",
    },
    {
        "Name": "Chemical Dependency",
        "Description": "You rely on pharmaceutical compounds like medical items.",
        "MPValue": 3,
        "Drawback": "For every 24 hours without taking a dose, you must make a successful Constitution save (DC 15) or take 1 point of Strength and Constitution damage. Taking a dose cures the damage caused by deprivation.",
    },
    {
        "Name": "Pheromone Repulsion",
        "Description": "You release pheromones that other creatures find repulsive.",
        "MPValue": 1,
        "Drawback": "You take a -2 penalty on all Diplomacy and Handle Animal checks made against targets within 30 feet of you.",
        "Special": "You cannot take this drawback if you have the Pheromone Attraction mutation. You can take this drawback multiple times.",
    },
    {
        "Name": "Reduced Speed",
        "Description": "You are unable to move as quickly as normal due to various mutations and deformities.",
        "MPValue": 2,
        "Drawback": "Reduce your base movement speed by 5 feet. This speed decrease also applies to any natural burrow, climb, fly, or swim speed you might have.",
        "Special": "You may take this drawback multiple times. You cannot use this to lower a Character's base speed by more than 10ft.",
    },
    {
        "Name": "Thin Skin",
        "Description": "You are more susceptible to harm.",
        "MPValue": 2,
        "Drawback": "Gain Weakness 1 (ALL). Any damage gains +1 to its total even after DR is accounted for.",
        "Special": "This can be taken up to 10 times for a total of Weakness 10 (ALL).",
    },
    {
        "Name": "Slow Minded",
        "Description": "You struggle to keep up intellectually with others. You often do not pick up things that others learn naturally or find intuitive. It is not that you cannot learn or master a topic. It simply takes more time to do so.",
        "MPValue": 3,
        "Drawback": "Gain XP Sink 5%.",
        "Special": "This can be taken up to 6 times. Cannot take any Feats that improve upon Intelligence. Cannot take if the Mutant's Character Path is Path of Intelligence (Smart Hero). Cannot take if the Mutant has the Brainiac mutation.",
        "Note": "This needs to be used with games that give out XP. Some games can use other methods to level up a Character. If this is the case, talk to the GM about how to slow down this Character's leveling or simply pick a different drawback.",
    },
    {
        "Name": "Weak Immune System",
        "Description": "Your body is particularly vulnerable to the ravages of poison, disease, radiation, and other ailments. You also have trouble stabilizing when severely wounded.",
        "MPValue": 3,
        "Drawback": "You take disadvantage on all Constitution saves. This includes death saving throws. Also, any saving throw for Poisons. Any saving throw for Nauseated or Sickened.",
        "Special": "You cannot take this mutation if you have the Great Fortitude or Ultra Immune System feat. Also cannot take this if the mutant has the Ultra Immune System mutation.",
    },
    {
        "Name": "Ultraviolet Allergy",
        "Description": "Ultraviolet light burns your flesh, causing it to ignite.",
        "MPValue": 3,
        "Drawback": "Ultraviolet light (including direct sunlight) burns you for Xd6 points of Thermal (Radiation) damage per minute of exposure. Where X is half the Character's level rounded down.",
    },
]

MutationDrawbacks = MUTATION_DRAWBACKS

MUTATION_ENHANCEMENTS = {
    "cosmetic": [
        {
            "Name": "Fins",
            "Description": "Your body sprouts fishlike fins. A fin might begin on the top of your head and go all the way down your spine. Others might appear on your forearms or calves, or they might sprout from your shoulders or ears. The fins confer no special abilities.",
            "Upgrade": "1MP Switches this from a Cosmetic to an Enhanced Ability type and costs the fins to grow along with webbing. No longer take a speed penalty while swimming and gain a +4 for Swim checks."
        },
        {
            "Name": "Forked Tongue",
            "Description": "You gain a forked tongue like that of a snake. Your new tongue might be a different color and longer than your old one."
        },
        {
            "Name": "Horns",
            "Description": "Two or more tiny horns sprout from your head, shoulders, or arms. These blunt-tipped nubs are too small to serve any use in combat."
        },
        {
            "Name": "Scaly Skin",
            "Description": "Your flesh thickens and becomes less porous, forming a thin layer of scales. The scales are typically smooth and dry, like those of a snake, and can vary in color and pattern. The scales may not cover your entire body; instead, they appear in patches on your face, neck, torso, and limbs.",
            "Special": "A creature with fur, scales, or chitin cannot gain this mutation."
        },
        {
            "Name": "Thin Fur Coat",
            "Description": "You grow a thin coat of brown or golden-brown fur, similar to that of a small mammal.",
            "Special": "A creature with fur, scales, or chitin cannot gain this mutation."
        },
        {
            "Name": "Unnatural Eyes",
            "Description": "The color of your eyes changes drastically. The color, whatever it may be, is unnatural and atypical of your species. Perhaps your eyes turn dead black, maybe they change color to suit your mood, or perhaps they glow faintly in the dark."
        },
        {
            "Name": "Unnatural Hair",
            "Description": "Your hair or fur color changes drastically to an uncommon shade for your species. You may have fur or hair that is multicolored, streaked, splotched, or slightly luminescent. Your hair or fur may also change color with your mood."
        },
        {
            "Name": "Unnatural Skin",
            "Description": "The color of your skin or exoskeleton changes drastically, assuming a hue or texture that is both unnatural and atypical of your species. Your skin might be a single color, splotched, or patterned in some freakishly unnatural way. Your skin might produce dynamic pigments that change color in response to external stimuli, such as ultraviolet light."
        },
        {
            "Name": "Unnatural Voice",
            "Description": "Your voice changes in some marked fashion. It might change pitch, becoming more lyrical, raspy, whispery, or guttural."
        }
    ],
    "offensive": [
        {
            "Name": "Adrenaline Jolt",
            "Description": "You can flood your bloodstream with extreme amounts of adrenaline to temporarily boost your Strength or Dexterity.",
            "Type": "Offensive",
            "MP Cost": 2,
            "Benefit": "Once per day, as a free action, you can temporarily increase either your Strength or your Dexterity by 1 point.",
            "Upgrade": "For every 1MP spent, either increase Strength and Dexterity +1 or increase the number of times per day by 1. After 4 extra MPs are spent, the upgrade cost goes up to 2MP."
        },
        {
            "Name": "Claws",
            "Description": "Your hands mutate into sharp claws.",
            "Type": "Offensive",
            "MP Cost": 2,
            "Benefit": "Natural Melee Claw Attack (Kinetic) (Based on Character size) Small 1d3, Medium 1d4, Large 1d6. The second hand is also Clawed and can be used as a Bonus Melee Attack.",
            "Upgrade": "1MP point increases damage by upgrading the dice. 1d3 becomes 1d4, and so on. Each time damaged is raised, it first increases bonus damage by one, and the next MP improves the Damage Die. IE: +1MP brings damage to 1d4+1, +2MP brings damage to 1d6+1, +3MP brings damage to 1d6+2, etc. Once more than 4 MP is spent, any additional damage requires 2MP.",
            "Special": "For 1MP you can make the claws retractable."
        },
        {
            "Name": "Dimension Affinity",
            "Description": "You can feel the waves that undulate underneath the fabric of the universe. It's the weaves and knots that hold it together that appear almost tangleble too you.",
            "Type": "Offensive",
            "MP Cost": 3,
            "Benefit": "Gain access to 1 Dimensional Trick from the **Prime** list. The Character can do this once per day. If the Character already is or becomes a Dimension Knight, then count these as Bonus Techniques.",
            "Upgrade": "Gain access to 1 more Trick and be able to do a trick once more per day. Every two upgrades increase the cost by 1MP. This upgrade can only be applied a total of 4 times and can only be done once per Character Level.",
            "Special": "None"
        },
        {
            "Name": "Energy Vampire",
            "Description": "You drain the life force or energy from other living things you can touch.",
            "Type": "Offensive",
            "MP Cost": 3,
            "Benefit": "Gain a Natural Touch attack that drains HP from the target and gives it to the Character. Touch 1d6 (None). The damage turns into Health for the Character. If the Character is already at max health, they gain 1/2 the remaining damage in temporary HP.",
            "Upgrade": "1MP Improves the damage by adding first a +1 damage bonus and then a Weapon Die level increase. I.e., First upgrade goes from 1d6 to 1d6+1, then from 1d6+1 to 1d8+1, then from 1d8+1 to 1d8+2, etc. Every other upgrade increases the cost by 1MP.",
            "Special": "3MP Multi Attack. If the Character is able to touch multiple targets, they can drain from as many of them at once as a single Standard Action attack. A roll for each Target is still necessary."
        },
        {
            "Name": "Enlarged Form",
            "Description": "You grow, becoming a freakishly large specimen of your kind.",
            "Type": "Offensive",
            "MP Cost": 4,
            "Benefit": "Character's body increases significantly in size. This means the Character is now one size category larger than before. Your weight is double, and your weight is x6. This effect can be done once per day and lasts for 1+Conn Mod turns (min 1). This provides +2 Strength, a -2 Dexterity (to a minimum of 1), a -1 to AC, and a temp HP bonus of 1HD (Hit Die) + Conn Mod.",
            "Upgrade": "1MP can increase the number of times per day and the number of turns by +1, so 2+Conn Mod. After 2MP has been spent on upgrades, the upgrade cost changes to 2MP.",
            "Special": [
                "For 2MP change the bonuses too: +4 Strength, a -3 Dexterity (to a minimum of 1), a -2 to AC, a temp HP bonus of 1HD (Hit Die) + Conn Mod, and 1DR for all damage types.",
                "If the Character wishes to stay Enlarged after their allowed number of rounds, they can roll a Conn Check DC12 + (Number of turns past limit). If they succeed, they stay enlarged but take 1 Conn Damage. If they fail, they shrink but still take 1 Conn Damage from the attempt."
            ],
            "Note": "This mutation does not change your face. If shrinking back down to normal reduces HP to below zero, the Player rolls a Con saving throw DC5 + (Number of points below zero). If passed, the Character has 1HP; if failed, the Character has 0 and passes out."
        },
        {
            "Name": "Fangs",
            "Description": "Your teeth mutate into vicious fangs.",
            "Type": "Offensive",
            "MP Cost": 2,
            "Benefit": "Gain a vicious natural bite attack that deals kinetic piercing damage dependent on your size: Small 1d3, Medium 1d4, Large 1d6. Gain +1 per 5 Character levels on Intimidate.",
            "Upgrade": "1MP point increases damage by upgrading the dice. 1d3 becomes 1d4, and so on. Each time damaged is raised, it first increases bonus damage by one, and the next MP improves the Damage Die. IE: +1MP brings damage to 1d4+1, +2MP brings damage to 1d6+1, +3MP brings damage to 1d6+2, etc. Once more than 4 MP is spent any additional damage requires 2MP.",
            "Special": "1MP allows the Fangs to be retractable and can be activated as a Free action. When retracted, this reduces the negatives to Disguise checks as if you didn't spend any MP on this Mutation. However, the Intimidate bonus also goes away.",
            "Note": "This mutation can be used in conjunction with the Acidic Saliva or Venomous Bite mutation. If so, this adds the Acidic or Venomous damage as bonus damage. (The bonus damage from these mutations does not stack IE: 1d4+1 Acid damage just adds the 1d4 as bonus damage to the Fangs bite attack)"
        },
        {
            "Name": "Great Horns",
            "Description": "You sprout horns capable of damaging or goring a target. The horns may be curled like a ram's or pointed like a bull's. Conversely, you may grow a single horn in the middle of the forehead, like that of a rhinoceros, or a large rack of antlers, like that of a moose.",
            "Type": "Offensive",
            "MP Cost": 3,
            "Benefit": "Gain a Natural Gore Attack that deals kinetic damage. The attack, however, requires a standard technique action. Damage depends on size: Small 1d4, Medium-size 1d6, Large 1d8. This also grants extra damage on a Charge Technique in the form of adding the Character's advantage die.",
            "Upgrade": "1MP point increases damage by upgrading the dice. 1d3 becomes 1d4, and so on. Each time damaged is raised, it first increases bonus damage by one, and the next MP improves the Damage Die. IE: +1MP brings damage to 1d4+1, +2MP brings damage to 1d6+1, +3MP brings damage to 1d6+2, etc. Once more than 4 MP is spent, any additional damage requires 2MP.",
            "Special": "Additional penalty of -1 to Disguise checks for every 3 MP spent on this Mutation (including to acquire it) (This auto adds the **Horns \\[Cosmetic\\]** mutation."
        },
        {
            "Name": "Radioactive",
            "Description": "You are exposed to some radiation, have DR for Thermal damage type, and can emit bursts of harmful radiation from your body.",
            "Type": "Offensive",
            "MP Cost": 4,
            "Benefit": "Immune to mild, low, and moderate degrees of radiation exposure. Also gain DR1 for Thermal Damage Type. In addition, your body acts as a radiation battery, storing the energy for later use. Once per day as a free action, you may release a 30-foot-radius burst of radiation centered on you. All creatures within the burst radius are exposed to a power blast of radiation. 1d6 Thermal Damage + Conn Save DC18 against getting Nauseated for 1 day.",
            "Upgrade": "1MP, either choose to give one more use per day or increase the damage die by one level. Each upgrade increases the cost of the next upgrade by 1MP.",
            "Special": "2MP Gain a Natural Radiation beam attack that can be used once per day. A Ray of Radiation extends from the Character. 1 Ray for every 4 Levels. Starting at level 1, at level 4 2 Rays at level 8 3 Rays etc\\... Each Ray does the same damage as the Radiation Blast i.e. starting 1d6. This consumes the Characters built up Radition. Each day the character can choose to either perform the Blast or the Ray action.",
            "Note": "The Character gives off radiation that is easily detectable and almost impossible to shield from. The Character must exhaust their Radiation once per day, or it becomes dangerous and makes the Character Nauseated after 24 hours, then another 24 hours they become Sickened and after that there Radiation is so deadly anyone around them takes a Conn Save DC15 + each day or else become Nauseated."
        },
        {
            "Name": "Tentacles",
            "Description": "A single tentacle grows from your side or back. The tentacle might resemble an octopus's suckered tentacle or a simple, scaly pseudopod.",
            "Type": "Offensive",
            "MP Cost": 1,
            "Benefit": "The tentacle grants advantage on Grapple checks. It can also grasp and manipulate a simple object of your size category or smaller. Characters also gain advantage checks associated with climbing.",
            "Upgrade": [
                "Requires Special Unlock. 1MP improves the Natural Attack by first adding a +1 to Accuracy/Damage and then increasing the weapon die level and so on. IE 1d6 upgrades to 1d6+1 upgrades to 1d8+1 upgrades to 1d8+2. Each upgrade increases the cost by 1MP.",
                "Requires Special Unlock. 1MP adds either Grapple or Trip as an effect to the Natural Grip Attack. This increases the Upgrade cost by 1MP."
            ],
            "Special": "3MP Gain a Natural Attack Grip Attack with 5ft Reach. Damage is described in Natural Attack."
        },
        {
            "Name": "Magnitism",
            "Description": "The Character can control electromagnetic fields. Can sense, manipulate, or produce them.",
            "Type": "Offensive",
            "MP Cost": 2,
            "Benefit": "Gain access to Electro-Mancer Level 0 Techniques. The number of uses is equal to an Electro-Mancer Class Level 1. This doesn't gain Bonus from Ability Modifiers, nor do Feats affect this ability.",
            "Upgrade": "1MP number of uses is equal to the next level Electro-Mancer Class. Every 2 upgrades increase the cost by 1MP.",
            "Special": "1MP gain access to the next level Electro-Mancer Techniques. You can take this more than once, and each special increases the cost of the next by 1MP."
        },
        {
            "Name": "Sonic Attack",
            "Description": "You can produce a massive sonic blast. This is normally produced from a species' mouth, but the Player can choose how they make the blast.",
            "Type": "Offensive",
            "MP Cost": 3,
            "Benefit": "Gain a powerful Natural Ranged (30ft) Attack 1d6 (Kinetic).",
            "Upgrade": "1MP Improves the Range by 10ft and improves the damage by adding first a +1 damage bonus and then a Weapon Die level increase. I.e., First upgrade goes from 1d6 to 1d6+1, then from 1d6+1 to 1d8+1, then from 1d8+1 to 1d8+2, etc. Every other upgrade increases the cost by 1MP.",
            "Special": "2MP Sonic Gernade. Gain the ability for 1 + Conn Mod (Min 0) times per day. The character releases a blast of Sonic energy emanating from the Character's body. This does damage to all things within the blast radius; there is no saving throw. The Radius is controlled by the Character but is limited to a minimum of 15ft or a maximum of the current range of their Natural Sonic Attack. This deals the same damage the Sonic Attack does, but to all within range."
        }
    ],
    "defensive": [
        {
            "Name": "Insane Reflexes",
            "Description": "You are extremely reactive to your environment. Your muscles seem to almost move on their own.",
            "Type": "Defensive",
            "MP Cost": 2,
            "Benefit": "Gain +2 to Dexterity Score and gain all bonuses associated with the higher score, which includes improved AC. Gain +1 Misc Bonus to Acrobatics. If the Character doesn't already have an Ability Affinity with Dexterity, gain this as well.",
            "Upgrade": "1MP gain +1 to Dexterity Score. For every 2 upgrades, increase the cost by 1MP."
        },
        {
            "Name": "Invisibility",
            "Description": "You can become invisible. Moving can cause people to see a weird shape of oddly reflecting light, but they cannot make out what it is or who they are. You are still visible to radar, sonar, and other detection and perception systems.",
            "Type": "Defensive",
            "MP Cost": 5,
            "Benefit": "Gain the ability to become Invisible at will. Any clothes worn by the Character at the point of becoming invisible are also invisible. However, things held in one's grip, such as a pistol, remain visible. When Invisible, the Character gains total concealment in combat as long as they do not move or attack. If they do, they gain partial concealment. Invisibility lasts for a total of 1 + 1/2 Character Level number of rounds before rest. The Character can choose when to spend those rounds.",
            "Upgrade": "None",
            "Special": [
                "2MP The Character's out-of-combat use of Invisibility switches from number of rounds to Minutes. And out of combat use of Invisibility is now its own counter that doesn't affect in combat time, which is still counted as turns.",
                "2MP The Character can now make anything they are holding, including another living person, invisible (out of combat) so long as they hold it. This takes concentration and effort. Consume the total number of Minutes twice as fast, and if something breaks the Character's concentration, they must roll a Wisdom saving throw in order to determine if the object or person they are holding becomes visible."
            ]
        },
        {
            "Name": "Prickly Pear",
            "Description": "Bony spurs or chitinous spikes or sharp needles protrude from all around your body, especially joints, and on your back, giving you a jagged profile and making you dangerous to grapple with.",
            "Type": "Defensive / Offensive",
            "MP Cost": 2,
            "Benefit": "Deal 1d4 points of piercing damage to any creature grappling or grappled by the Character. Deal 1d4 points of piercing damage per round to any creature that tries to eat or swallow the Character.",
            "Upgrade": [
                "1MP Increases the defensive damage dealt from grapple or eating by 1 Weapon Damage Die Level. This increases to 2MP after two upgrades.",
                "Unlocked with Special. 1MP increases damage by upgrading the dice. 1d3 becomes 1d4, and so on. Each time damaged is raised, it first increases bonus damage by one, and the next MP improves the Damage Die. IE: +1MP brings damage to 1d4+1, +2MP brings damage to 1d6+1, +3MP brings damage to 1d6+2, etc. Once more than 4 MP is spent any additional damage requires 2MP."
            ],
            "Special": "2MP Change this to a Defensive Type. These spikes or needles can shoot from your body and target nearby enemies. Gain a Natural Ranged Attack. (Kinetic) (Based on Character size) Small 1d3, Medium 1d4, Large 1d6."
        },
        {
            "Name": "Regeneration",
            "Description": "Your body can simply regenerate from damage. Recovering from an injury is super quick and easy. However, your body doesn't respond well to healing elixirs, and medical equipment often doesn't understand what is happening.",
            "Type": "Defensive",
            "MP Cost": 2,
            "Benefit": "Gain 1HP (+1 for every 2 Hit Die) Regeneration. This means each round of combat or every 3 seconds, gain 1HP until restored to full health. If the Character is level 2, this would be 2HP. At level 4, it would be 3HP, 6 4HP, and so on. Medical checks and other health-restoring items/devices only restore half as much as they normally would. Extreme wounds, such as losing a limb, will heal slowly but eventually recover completely. (This doesn't impact Ability Damage)",
            "Upgrade": "1MP gain +1HP more. IE: 2HP (+1 for every 2 Hit Die) Regeneration. This upgrade increases the cost of each subsequent upgrade by 1MP.",
            "Special": "3MP Gain some semblance of Imortality. If brought down to zero hit points at the start of the first round, the Character takes the normal 1d4 Constitution Damage and then stabilizes to 1HP. The Character becomes conscious and is able to finish their round as if they had just completed a Standard Action. If completely killed, as long as the majority of the body is in one piece, the body will regenerate. Once out of combat, the Character instantly gains 1 Constitution. And then Conn heals completely as normal."
        },
        {
            "Name": "Scaly Armor",
            "Description": "Thick, overlapping scales cover your body. The scales are hard but dry to the touch.",
            "Type": "Defensive",
            "MP Cost": 2,
            "Benefit": "Gain a +2 Natural armor to AC, or existing natural armor bonus improves by 2.",
            "Upgrade": "1MP gain +1 Natural Armor to AC. Each upgrade increases the cost of the next upgrade by 1MP.",
            "Special": "1MP gain 1DR against Kentic, Thermal, Chemical, but NOT Electric. This special can be taken multiple times. Each time, the cost increases by 1MP.",
            "Note": "A creature with fur, chitin, or the Exoskeleton mutation cannot gain this mutation."
        },
        {
            "Name": "Skeletal Reinforcement",
            "Description": "Your bones become more resilient, allowing you withstand greater amounts of punishment.",
            "Type": "Defensive",
            "MP Cost": 2,
            "Benefit": "The Character no longer has to be concerned with Massive Damage. Fall damage is always reduced by half. Character gains 1DR for Kentic damage.",
            "Upgrade": "1MP increases DR by 1. For every 2MP points spent on upgrades, the cost increases by 1MP.",
            "Special": "1MP. Gains DR for one other Damage Type of Characters' choice. This DR starts at 1 and increases with every upgrade alongside the existing DR, increasing the upgrade cost by 1MP.",
            "Note": "Cannot take this mutation if you have the Brittle Bones drawback."
        },
        {
            "Name": "Smokescreen",
            "Description": "You expel chemicals through your pores, creating an inky-black cloud of smoke that envelops you and the surrounding area.",
            "Type": "Defensive",
            "MP Cost": 1,
            "Benefit": "Once per day, as a free action, the Character can produce a 20-foot-radius cloud of smoke centered on themselves. The cloud is stationary once created. The inky-black smoke obscures all sight, including darkvision, beyond 5 feet. A creature 5 feet away has one-half concealment (20% miss chance). Creatures farther away have total concealment (50% miss chance, and the attacker cannot use sight to locate the target).",
            "Upgrade": "1MP increases the number of times per day this can be done or increases the radius by 5ft. For every 2MP spent, the cost increases by 1MP.",
            "Special": "Attributes can be added to this that turn it into an area of effect attack. Such as Venonous or Poison. (MP cost of attribute + 1) When done this way in combat, this now becomes a Standard Action. Also, this Mutation now counts as both a Defensive and Offensive mutation and costs 1MP more on upgrades regardless of whether it is Secondary or not.",
            "Note": "This ability functions underwater. A moderate wind or current disperses the cloud in 4 rounds. A strong wind or current disperses the cloud in 1 round."
        },
        {
            "Name": "Thick Fur Coat",
            "Description": "You grow a thick, protective layer of fur over your body.",
            "Type": "Defensive",
            "MP Cost": 1,
            "Benefit": "Gain 1DR against Thermal. Gain advantage on Constitution saves for weather or temp-related effects.",
            "Upgrade": [
                "1MP gain one more DR against Thermal. Each upgrade increases the cost by 1MP. Once 3MP of upgrades have been spent (including upgrade 2) gain double advantage on Conn saving throws associated with Weather or temp related effects.",
                "Requires Special to unlock. 2MP gain one additional AC of Natural Armor. This can only be taken every 3 levels. Each time this is taken, increase the upgrade cost by 1MP."
            ],
            "Special": "2MP The fur grows over every inch of the Character's body and becomes an undeniable and impossible to hide trait. -5 to Diguese checks. Gain 1AC natural Armor.",
            "Note": "A creature with fur, scales, or chitin cannot gain this mutation."
        }
    ],
    "enhancements": [
        {
            "Name": "Chameleon Skin",
            "Description": "Your skin can rapidly change color and even texture in patterns that resemble its surroundings.",
            "Type": "Enhanced Ability",
            "MP Cost": 2,
            "Benefit": "Gain +2 Misc Bonus on Stealth Checks as well as Advantage on all Stealth Checks. Also, the Character does not count the MP spent on this Mutation towards the negative Disguise checks that are part of Innate Drawbacks.",
            "Upgrade": "1MP gain an additional +2 to Misc Bonus on Stealth Checks. Every 3 upgrades increase the upgrade cost by 1MP.",
            "Special": "None"
        },
        {
            "Name": "Darkvision",
            "Description": "You gain low-light vision.",
            "Type": "Enhanced Abilities",
            "MP Cost": 1,
            "Benefit": "You can see in low light out to a range of 60 feet. Your vision becomes increasingly black-and-white at this point. No negative effect for Perception in darkness.",
            "Upgrade": "Spending 1MP increases the range by another 60 feet.",
            "Special": "Spending 1MP gives complete darkvision, allowing the person to see in total darkness up to half the distance they can see in low light."
        },
        {
            "Name": "Echolocator",
            "Description": "You develop the ability to absorb sound waves and translate them into mental images that accurately portray the surrounding environment. This ability is similar to a bat's ability to operate and hunt in total darkness via echolocation.",
            "Type": "Enhanced Abilities",
            "MP Cost": 2,
            "Benefit": "You gain Blind Fight feat. You can have a Bonus +2 to Perception, which counts as Misc Modifiers for Passive Perception checks.",
            "Upgrade": "1MP, this increases the Perception Misc Modifier by +2. This can only be done once every 5 levels.",
            "Special": "If you already have Blind Fight, you can remove this Feat and gain another Feat at your next level. The Character can only gain a Feat from the Skill Enhancements or Combat Martial Arts categories."
        },
        {
            "Name": "Elasticity",
            "Description": "You can bend and twist your body in unnatural ways and squeeze through very tight spaces.",
            "Type": "Enhanced Abilities",
            "MP Cost": 2,
            "Benefit": "Gain the Escape Artist Feat which grants the Escape Artist skill. Add +1 Misc Mod to the Skill. Gain an advantage in getting out of a Grapple.",
            "Upgrade": "1MP gain 1 Free Rank in either Acrobatics or Athletics and +1 Misc Mod to the Escape Artist skill. If the Character is at their Rank limit for either Acrobatics or Athletics, then they cannot upgrade this Mutation.",
            "Special": "2MP. This allows the Character to become stretchy and extend the length of their limbs, neck, and torso to twice their range. This can give the Character a 5 ft. reach with melee weapons, but they have to take a Disadvantage when using it. If a Strength check or saving throw is involved when stretched gain a disadvantage unless the action is an attempt to return to normal length. This also grants a double advantage in getting out of a Grapple."
        },
        {
            "Name": "Extra Arms",
            "Description": "You grow an additional pair of arms. The extra arms look and behave exactly like your other arms.",
            "Type": "Enhanced Abilities",
            "MP Cost": 2,
            "Benefit": "Gain two more arms. Gain a +4 bonus to Climb and Grapple Checks. For the purposes of combat, both extra arms are treated as \"off hands\" (that is, you still have only one primary hand), and you can only use one hand/arm for the purposes of double-handed weapons or off-handed weapons. So, fundamentally, this doesn't change combat.",
            "Upgrade": "1MP Gain +2 to Climb and Grapple checks. The first time an upgrade is spent on this Mutation gain Advantage on freeing from grapple. After 3 MP is spent improving this mutation (either with upgrades or special), upgrades/and special cost an additional 1MP.",
            "Special": "2MP If the Character also has a natural melee attack like Clawed hands, they can now use their new mutated hands to gain an extra Free Attack Action when using a Standard Attack action with their Claws. Also, when using a Standard Attack action with either duel-wielding melee weapons or wielding a two-handed melee weapon, you gain a Bonus Attack using your claws from your mutated hands.",
            "Note": "If the Character has natural melee attacks like Clawed hands, these do not allow for extra attacks without first spending more MP with the special."
        },
        {
            "Name": "Life Giver",
            "Description": "You can use your own overflowing life force to help others.",
            "Type": "Enhanced Ability",
            "MP Cost": 2,
            "Benefit": "Gain the ability to heal others while in combat as a simple action. This Heal action doesn't require a check and can be performed only once per turn. The Character has to be able to touch the Target. The restored HP is equal to the Target's Hit Die + Character's Advantage Die. Also, while out of combat, gain Luck on Medical Skill checks. Also, the Character does not need a First Aid Kit or Medical Kit to perform Medical \"Medical\"){.wikilink} checks. A Character can only do the Medical Skill check or in-combat Healing 1 + Conn Mod (Min Zero) number of times per day.",
            "Upgrade": "2MP increases the total HP restored to 2 Hit Die (Targets) + Character's (Mutant) Advantage Die. And the base number of times per day by 1.",
            "Special": [
                "1MP allows the Mutant to be able to do this to 2 targets per turn, while counting the Heal action only once, as long as both targets are able to be touched at the same time.",
                "2MP Life Giver. The Mutant Character can choose to give their own personal life force to heal an injured target. They drain their own HP and instantly transfer it to the target, restoring HP and even granting a temporary HP bonus. This means the Target can receive more HP than their max allows. This goes away after rest. The Mutant can do this special as long as they have more than 1 HP to give."
            ]
        },
        {
            "Name": "Gills",
            "Description": "You grow a set of gills that can draw the oxygen out of water. The gills appear on your neck, chest, or back (near your windpipe or lungs).",
            "Type": "Enhanced Ability",
            "MP Cost": 1,
            "Benefit": "You can breathe both air and water. You can operate underwater indefinitely without drowning.",
            "Upgrade": "None",
            "Special": "This can be a Drawback that grants 1MP back to the Character. When doing this, the Gills must be kept constantly wet, as they can easily dry out. This causes Nauseated and 1d4 temp Conn damage for every 12 hours it isn't wetted again. If the Character is exposed to an extremely dry environment, they must immediately cover their Gills with something wet, or they will instantly dry out. This can become a serious issue in freezing environments."
        },
        {
            "Name": "Leaper",
            "Description": "You gain the ability to leap incredible distances.",
            "Type": "Enhanced Ability",
            "MP Cost": 1,
            "Benefit": "Character can leap 20ft spans at a dead stop and 30+ft with a running start. Gain a +5 mutation bonus to any Athletic/Acrobatics check that involves jumping. By default,t the Character cannot carry other Characters or use this ability if encumbered.",
            "Upgrade": "1MP gains an additional 5ft max jumping distance and an additional +5 bonus to checking involving jumping. Each upgrade makes the cost of the next upgrade increase by 1MP.",
            "Special": [
                "1MP your legs have super strength. Your weight and/or carrying capacity is as if your strength score is 6 points higher. You can now carry one other Character of your same size or 2 of a smaller size when leaping and take no penalties. This Special cannot be taken until the Mutant is at least level 7.",
                "2MP your default walking speed is increased by 50% round up, both in and out of combat. Walking no longer tires you out. You cannot become Fatigued or Exhausted from simply walking, and it takes twice as long to become Fatigued from running."
            ]
        },
        {
            "Name": "Pheromone Attraction",
            "Description": "You can regulate the production of pheromones in your body and release them at will, altering the moods of other nearby creatures.",
            "Type": "Enhanced Ability",
            "MP Cost": 3,
            "Benefit": "Gain a +2 Misc Modifer on all Bluff, Diplomacy, Handle Animal, and Intimidate checks made on targets within 30 feet. Gain the ability to draw the attention of out-of-combat NPCs/Monsters to Character location if they are within 120ft. The NPC/Monster must roll a DC15 Wisdom save. If they succeed, they know that something is pulling them attentively towards them. Otherwise, they mindlessly feel a strong desire to move in your direction. In an outdoor situation, downwind can carry the scent in a specific direction rather than in all directions, and in a vented area, if the vents lack strong filters, the effect can cause confusion and spread throughout the ship/facility/house. This scent must take a 3-second standard action without qualifying for any bonus actions that require the Character to be still and can only be done once per day. The DC increases by 1 for every 5 Character levels. IE: Level 1-4 the DC is 15, Level the DC 5-9 16, and so on.",
            "Upgrade": "1MP gain an additional +1 to Bluff, Diplomacy, Handle Animal, and Intimidate and allow the Character to do the scent drawing ability one more time a day. Once 3 MP is spent, the cost of upgrading increases to 2 MP.",
            "Special": "You cannot take this mutation if you have the Pheromonal Repulsion drawback/quirk."
        },
        {
            "Name": "Prehensile Tail",
            "Description": "You grow a tail that can grasp and hold objects.",
            "Type": "Enhanced Ability / Offensive",
            "MP Cost": 1,
            "Benefit": "A prehensile tail grants a +2 Misc Bonus on Acrobatics checks. It can also grasp and manipulate a simple object weighing up to 5 pounds. A prehensile tail cannot be used to operate equipment that requires opposable digits or fine motor control (such as a cell phone). A creature can \"hang\" from its prehensile tail indefinitely by wrapping it around a larger object, thereby freeing up its other limbs. The prehensile tail isn't dexterous or strong enough to fire ranged weapons or make melee attacks, however.",
            "Upgrade": [
                "Unlick with Special. 1MP Adds +1 Attack Accuracy and Bonus Damage. After 2 upgrades, the cost increases to 2MP.",
                "Unlock with Speical. 2MP choose to either gain 5ft Reach, the Trip ability, or the Grapple ability with the Wip Attack. You can take this Upgrade twice, but you cannot have both Trip and Grapple."
            ],
            "Special": "2MP. Gives the tail more strength and the ability to perform a Natural Wip Attack. Damage is based on size using the size chart for the Natural Attacks table. This is just the attack, and no secondary effects like Trip, Grapple, or Poison apply. This Mutation now takes up both an Enhanced Ability and an offensive type slot, and any additional rules associated with gaining a Secondary for a Mutation type apply."
        },
        {
            "Name": "Scent",
            "Description": "You can detect approaching enemies, sniff out hidden foes, and track by sense of smell. You can also identify familiar odors the way humans do familiar sights.",
            "Type": "Enhanced Abilities",
            "MP Cost": 1,
            "Benefit": "Gain +2 Misc Bonus to Perception, which also counts towards Passive Perception. Characters can also use their scent to gain an advantage when attempting to detect and identify poisons.",
            "Upgrade": "1MP gain an additional +2 Msc Bonus Perception, which also counts towards Passive Perception. Each upgrade increases its cost by 1MP.",
            "Special": "None"
        },
        {
            "Name": "Resilient",
            "Description": "You can shrug off minor wounds with ease.",
            "Type": "Enhanced Ability",
            "MP Cost": 2,
            "Benefit": "Once per day, as a free action, outside of combat, the Character can heal themselves by one Hit Die.",
            "Upgrade": "1MP Either improve the number of times per day or the number of Hit Die. Each upgrade increases cost by 1MP. The total Hit Die cannot exceed 1/3 (round down) (Min 1) Character levels.",
            "Special": "1MP Add the Character's Conn Mod (minamun 1HP) per Hit Die healed."
        },
        {
            "Name": "Polymorph",
            "Description": "You can change your shape into anything you can see. This requires effort and time and is often not precise. A keen eye can notice something if off.",
            "Type": "Enhanced Ability",
            "MP Cost": 2,
            "Benefit": "The Character can change their shape and appearance into something or someone else. By default, they cannot be significantly resized. But they can mimic another person or species of the same size category with extreme precision. Lose all negatives for the digestive system associated with being a Mutant. Gain a +5 to Disguise checks. Gain Luck when performing Disguise checks. The Character cannot morph into a creature of a different size. Nor can they morph into a Creature or Person they have not Studied. The Study check is a DC15. Any miss reduces the Diguise bonus by the amount missed. For every 3 points past the DC, gain an additional +1 bonus. This bonus stays and does not need to be reapplied to that specific target, such as a specific species or NPC. If a Character morphs into a creature, they can mimic their natural attacks if they have a Kinetic damage type. A Character cannot morph into a giant venomous snake and use their poison attack. They can bite and do damage accordingly, but they don't gain any Chemical damage or poison. Furthermore, they retain their existing AC and DR.",
            "Upgrade": "1MP Gain an additional +3 to Disguise and gain Advatage bonus on Study checks. (Even when taking 10/20).",
            "Special": "If taken with Enlarged Form, the Character can now change shape to one size larger **OR** smaller and also gain the associated attribute bonuses.",
            "Note": "If the Character has the Natural Abilities or special upgrades that grant them the necessary traits, they can completely mimic a Natural Attack that a monstrous creature may have. Take the above example of a Venomous Snake. If the Character has a Venomous or Chemical attribute granted to this Mutation (Or another mutation), then when they Morph into the Snake, they get the full ability of the Natural Attack."
        },
        {
            "Name": "Wall Crawler",
            "Description": "You can walk on walls and cling to ceilings like a spider. You have tiny barbs on your hands and feet to facilitate climbing, and your fingers and toes secrete a transparent adhesive that lets you cling to smooth surfaces.",
            "Type": "Enhanced Ability",
            "MP Cost": 2,
            "Benefit": "As long as the Character's hands and feet are uncovered, they can climb perfectly smooth, flat, vertical surfaces. In addition, gain an advantage on all Climb checks and can climb at full speed and even use Run and Sprint while climbing. Gain +1 Misc Bonus on Acrobatics skill.",
            "Upgrade": "1MP gain double advantage on climb checks and +2 Misc Bonus on Acrobatics. A second upgrade costing 2MP increases this to triple advantage and +4 Misc Bonus on Acrobatics.",
            "Special": "None"
        },
        {
            "Name": "Wings",
            "Description": "You sprout a pair of birdlike or batlike wings.",
            "Type": "Enhanced Ability",
            "MP Cost": 1,
            "Benefit": "Wings grant the Character a new mode of movement with Flying. For checks for flying in difficult environments, such as windy conditions, use the Pilot or Acrobatics whichever is higher. When choosing this ability, the Player must choose what type of wings the Character gains. This changes the Flight to either Active Flight, Hoover, or Glide. To learn more about flight, visit Locomotion.",
            "Upgrade": "1MP increases the level of flight, the duration, and the maximum weight carried all by 2x. Every 2 upgrades increases the cost of this upgrade by 1MP.",
            "Special": "1MP by default, all attacks done while flying take double disadvantage. Taking this special reduces that to one disadvantage; taking it again removes the disadvantage completely."
        },
        {
            "Name": "X-Ray Vision",
            "Description": "You can see into and through solid matter either by using an actual X-Ray or some other source of power that allows you to see things normally blocking all visible light.",
            "Type": "Enahcned Ability / Offensive",
            "MP Cost": 1,
            "Benefit": "X-ray vision allows the Character to see through 6 inches of brick or stone, 1 inch of metal or composite alloy, and up to 1 foot of wood, plaster, or dirt. Thicker substances or a thin sheet of lead block your vision. This works up to 20Ft from the Character.",
            "Upgrade": [
                "1MP Increase the thickness of all above-mentioned materials by double and increase the Range of this ability by double. Every two upgrades increase the cost by 1MP.",
                "Unlock with Special 2. 1MP Improve Natural Attack damage. First with +1 to Accuracy/Damage and then to Weapon Die level. I.e; 1d6 upgrades to 1d6+1 upgrades to 1d8+1 upgrades to 1d8+2. Each upgrade adds +1 to the total number of times per day the Character can use this attack. Each upgrade increases the cost of the next by 1MP."
            ],
            "Special": [
                "1MP Grants darkvision up to the current distance the Character can use their X-Ray Vision.",
                "2MP Gain Laser Eyes. As a Natural attack done 1 + Conn Mod (Min 1) times per day, use your Vision ability to do Thermal (Radiation) Damage with a Ranged (60ft) Touch Attack. Damage 1d6 (T; Radiation)."
            ]
        },
        {
            "Name": "Super Speed",
            "Description": "The muscles of your legs and other appendages, which are used for movement, are significantly enhanced.",
            "Type": "Enhanced Ability",
            "MP Cost": 1,
            "Benefit": "Gain x2 base speed. A character can go twice the distance while walking a long distance. If the Character travels the normal distance, then they are not fatigued.",
            "Upgrade": "1MP Gain +1 multiplier to base speed. Max upgrade is x5 speed.",
            "Special": "2MP Gain an ability in combat to move so fast as to avoid penalties for moving around enemies. Also, gain double advantage to Charge, Push, Overrun, and Tackle."
        },
        {
            "Name": "Ultra Immune System",
            "Description": "You develop a powerful immune system capable of repelling many poisons, diseases, and radiation sickness.",
            "Type": "Enhanced Ability",
            "MP Cost": 1,
            "Benefit": "Gain Ultra Immune System as a bonus feat. If the Character already has this Feat, then gain access to another Misc Feats at the Character's next level.",
            "Upgrade": "1MP Gain double advantage on Constitution saving throws to resist poisons, diseases, and radiation sickness. Recovery from poisons, disease, and radiation sickness takes 1/2 the time. This can be taken one more time at a cost of 2MP, granting triple advantage and reducing recovery time to 1/4th.",
            "Special": "None"
        }
    ]
}

MutationEnhancements = MUTATION_ENHANCEMENTS

_db_instance = None


def get_reference_db():
    global _db_instance
    if _db_instance is None:
        try:
            config = loadYamlDBConfig()
            db_name = config.get("dbName", "futurepathapi")
            _db_instance = DBConnection(databaseName=db_name)
        except Exception as e:
            log.error(f"Error connecting to DB: {e}")
            return None
    return _db_instance


def init_reference_tables(db_conn=None):
    if db_conn is None:
        db_conn = get_reference_db()
    if db_conn is None:
        return None

    tables_data = {
        "character_paths": CHARACTER_PATHS,
        "species": [{"name": item} for item in SPECIES],
        "professions": PROFESSIONS,
        "occupations": [{"name": item} for item in OCCUPATIONS],
        "advantage_die_levels": [
            {"level": i + 1, "die": item} for i, item in enumerate(ADVANTAGE_DIE_LEVELS)
        ],
        "skill_die_levels": [
            {"level": i + 1, "die": item} for i, item in enumerate(SKILL_DIE_LEVELS)
        ],
        "sizes": [{"name": item} for item in SIZES],
        "quirks": QUIRKS,
        "detractors": DETRACTORS,
        "mutation_drawbacks": MUTATION_DRAWBACKS,
        "mutation_enhancements": [MUTATION_ENHANCEMENTS],
    }

    for table_name, data in tables_data.items():
        try:
            existing = list(db_conn.find(collection=table_name))
            if not existing:
                db_conn.insertMany(data, collection=table_name)
        except Exception as e:
            log.error(f"Error initializing table {table_name}: {e}")

    return db_conn
