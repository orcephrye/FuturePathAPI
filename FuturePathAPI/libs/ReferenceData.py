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
    "Path of Strength (Strong Hero)",
    "Path of Dexterity (Fast Hero)",
    "Path of Constitution (Tough Hero)",
    "Path of Intelligence (Smart Hero)",
    "Path of Wisdom (Dedicated Hero)",
    "Path of Charisma (Charismatic Hero)",
    "Path of No Path (The Freelancer)",
    "Ovex Path",
]

SPECIES = [
    "Humans",
    "Volar",
    "Graylings",
    "Lepidonains",
    "Cryous",
    "Ovex",
    "Aconians",
    "Murids",
    "Avisari",
    "Khepri",
    "Sayor",
    "Kurgian",
    "Tygerion",
    "Xrototaxian",
    "Chronodes",
]

PROFESSIONS = [
    "Combat Medic",
    "Dimension Knight",
    "Dreadnought",
    "Engineer",
    "Envoy",
    "Electro-Mancer",
    "Field Officer",
    "Helix Warrior",
    "Shield Splicer",
    "Space Marine",
    "Starfighter",
    "Swindler",
    "Technosavant",
    "Tracer",
    "Xenophile",
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
    "1d2",
    "1d2+1",
    "1d4+1",
    "1d4+2",
    "1d6+2",
    "1d6+3",
    "1d8+3",
    "1d8+4",
    "1d10+4",
    "1d10+5",
    "1d12+5",
    "1d12+6",
    "2d6+7",
    "2d8+7",
    "2d8+8",
    "2d10+8",
    "2d10+9",
    "2d12+9",
    "2d12+10",
]

SKILL_DIE_LEVELS = list(ADVANTAGE_DIE_LEVELS)

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
        "character_paths": [{"name": item} for item in CHARACTER_PATHS],
        "species": [{"name": item} for item in SPECIES],
        "professions": [{"name": item} for item in PROFESSIONS],
        "occupations": [{"name": item} for item in OCCUPATIONS],
        "advantage_die_levels": [
            {"level": i + 1, "die": item} for i, item in enumerate(ADVANTAGE_DIE_LEVELS)
        ],
        "skill_die_levels": [
            {"level": i + 1, "die": item} for i, item in enumerate(SKILL_DIE_LEVELS)
        ],
        "sizes": [{"name": item} for item in SIZES],
        "quirks": QUIRKS,
    }

    for table_name, data in tables_data.items():
        try:
            existing = list(db_conn.find(collection=table_name))
            if not existing:
                db_conn.insertMany(data, collection=table_name)
        except Exception as e:
            log.error(f"Error initializing table {table_name}: {e}")

    return db_conn
