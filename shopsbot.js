require('dotenv').config();

const cron = require('node-cron');

const { Client, GatewayIntentBits } = require('discord.js');

const fs = require('fs');

const prefix = 'alc!';

const INGREDIENTS = {
  common: [
    "Turmeric","Bastardberry","Wildecrest Elm Leaves","Yew Twigs","Toadstool",
    "Indigo Milk Cap","Latticed Stinkhorn","Octopus Stinkhorn","Black Mold",
    "Spettow Sap","Alder Sap","Beechnut Sap","Iron","Copper","Tin",
    "White Pigment","Lead-tin Yellow Pigment","Yellow Ochre Pigment",
    "Malachite Pigment","Raw Sienna Pigment","Raw Umber Pigment",
    "Clear Quartz","Onyx","Rose Quartz","Amethyst","Citrine",
    "Chalcedony","Garnet","Eye of Newt","Toe of Frog",
    "Adder’s Fork","Blind Worm’s Sting","Goblin Teeth"
  ],

  uncommon: [
    "Starwyn","Hemlock","Pirhana Hazel","Meadowroyal","Reaper’s Nightshade",
    "Sanguine Root","Amethyst Deceiver","Bleeding Tooth","Brain Mushroom",
    "Hickory Sap","Funeral Sap","Granny Crowthorn Sap","Tarbark Sap",
    "Golden Magnolia Sap","Lead","Mercury","Quicksilver","Silver",
    "Burnt Sienna Pigment","Burnt Umber Pigment","Azurite Pigment",
    "Verdigris Pigment","Terra Verde Pigment","Massicot Pigment",
    "Minium Pigment","Obsidian","Opal","Labradorite","Jade",
    "Moonstone","Toaddrake Scales","Skydrake Feathers",
    "Waterdrake Scales","Unnamed Congealed Black Substance","Smeech"
  ],

  rare: [
    "Sundrop","Moondrop","Blushing Belle","Bard’s Lily","Blue Pinkgill",
    "Viscid Devil","Cancer Lichen","Sciper Sap","Asejetto Sap",
    "Twisthorn Sap","Wyrmroot Sap","Gold","Vermillion Pigment",
    "Chrysocolla Pigment","Silver Pigment","Gold Pigment",
    "Lapis Lazuli","Bismuth","Ruby","Sapphire","Emerald",
    "Flamedrake Scales","Irondrake Scales","Faerie Dust",
    "Oil of Gold","Grief Tears"
  ],
"veryRare": [
  "Screaming Tomato","Fae-Yew Sap","Aventurine","Diamond","Unicorn Hair"
],

"enigmatic": [
  "Blood of the Aether"
]
};

const ASTRO_BULLSHIT_ITEMS = [
	`Astro comes to your house to live there and set up his shop there for one week. Damn bitch, you live like this?`,
	`Therapy`,
	`Mystery Potion`,
	`Gambling addiction self help book`,
	`10 minute blinding stew`,
	`An entire 400 lb/200 kg roast waterdrake`,
	`Camel™ Blue Box Turkish Domestic Blend`,
	`A fortune cookie that says “You are having a heart attack! THIS IS A MEDICAL EMERGENCY. GO TO THE HOSPITAL NOW.”`,
	`Very Strong Elixir of Gambling Addiction Recovery`,
	`Very Strong Elixir of Boob Enlargement`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`A handsome young man from the country who takes off his hat and holds it to his chest and as you ask him, “What’s your name, boy?” he says “Well, Ma’am/Sir/ToAThem, I ain’t got no name on account of my mammy passed ‘fore she could give me one, but my father’s name was Johnny Cassidy so they call me John Tommy Cassidy. My father done passed from the typhus long time ago, I ain’t got nowhere to stay or call home, I can’t read nor write neither, but I’m mighty good with horses and I can mend them fence posts what I saw on my way in and won’t ask for nothing much more than a hot meal and a warm barn to sleep in”`,
	`Eye daisy`,
	`A genderless version of yourself`,
	`Dude wifes`,
	`Someone’s printed out character sheet`,
	`A digital camera. The only video on it is a slideshow of black and white in memoriam photos of every North Island Massacre victim with their name, age, birthdate and deathdate, accompanied by the Billie Eilish meow meow meow song.`,
	`Gay thoughts`,
	`Sin`,
	`Starbrewer trading card`,
	`A comic book depicting the last week of your life`,
	`A fortune cookie containing the coordinates of an undiscovered COG base`,
	`Spine whip`,
	`Untamed Fons Iuventis Splash Potion`,
	`Fortune cookie with the most concerning possible niche reference to the character receiving it`,
	`Starbrewer trading card`,
	`Baby cow`,
	`20 years hard labor`,
	`Duck onesie! :3`,
	`Disembodied frog legs that bounce around randomly`,
	`Evil torture cube`,
	`Leaves`,
	`A stone statue of an angel with two blue human eyes that follow you`,
	`Expired eyeball`,
	`Picture of 14 year old you`,
	`A gun`,
	`Box of melatonin gummies (strawberry flavor, 10 mg, 60 ct)`,
	`40 oz of red bull mixed with 9 shots of 5 hour energy in a large cup labeled “coca cola”`,
	`4 hens, 1 rooster, 1 hen chick, and 1 rooster chick`,
	`An hourglass with sand suspended midair, permanently stuck at halfway`,
	`A newborn human baby`,
	`The French language`,
	`An extra four inches of height`,
	`A random foundling’s citizenship papers`,
	`An evil bizarro version of your friend group that hates you and bullies you`,
	`A shrine dedicated to (character) by their secret admirer`,
	`A candle that cannot be lit, at all`,
	`Masculinity`,
	`A genderbent version of yourself`,
	`Graduating photo of the class of 1999`,
	`Trader Joe’s Kickin’ Lickin’ Teeth`,
	`The grade of each student who takes an upcoming second year exam`,
	`Four less inches of height`,
	`A clay model of the face of someone you know with real human teeth and eyes (not theirs dw)`,
	`Box of 45 Australian Shepherd puppies`,
	`Tiny clone of your current/former Academy roommate`,
	`Shirt with the most concerning possible niche reference to the character receiving it`,
	`A shard of the voidstone`,
	`Baby ocelot`,
	`The diary of a random academy student`,
	`The voice of a pre-teen boy undergoing puberty changes`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`Can of turpentine`,
	`All of (character’s) money`,
	`Eight Normal Gorillas (NOT FRIENDLY)`,
	`Ego’s actual irl dog`,
	`A random character’s classified medical history`,
	`Whatever I had for breakfast this morning`,
	`Croissant`,
	`The Eight Friendly Gorillas! :D`,
	`The opposite day version of yourself`,
	`SKELETON LORD VYLTAZAR`,
	`Very Strong Potion of Period Generation`,
	`Lin-Manuel Miranda’s Alexander Hamilton costume from Hamilton (2015)`,
	`A raw potato with “Happy birthday!” and your date of birth written on it in marker`,
	`Strbr. Wisteria Roseblade`,
	`A full sized replica of the Statue of Liberty`,
	`All the vines in this 2015 YouTube compilation`,
	`A briarhulker`,
	`Horse`,
	`A primal phone that can only open TikTok (note: there is no service in Azekereth)`,
	`What was once a dress made of plastic that was destroyed by a dangerous crow boy whos job it is to destroy plastic, thus turning to dust`,
	`4 ft tall 60 lb (48 in / 28 kg) cucumber statue`,
	`Violent impulses`,
	`Whatever YOU had for breakfast (or otherwise your first meal of the day) this morning (if you haven’t eaten today and it’s after 1 PM your time you don’t get anything until you eat)`,
	`Peruvian Thick-knee Bird`,
	`Cocaine`,
	`Nintendo Switch Lite with Stardew Valley`,
	`Orb that makes you witness the death of a loved one`,
	`Monopoly`,
	`Acapella covers of (musical artist’s) greatest hits`,
	`Diary of Judith Maywood`,
	`A poster`,
	`Sandy loam`,
	`Australian cards against humanity`,
	`Potion labeled “potion that makes you infertile for 10 days”`,
	`Dual citizenship in Switzerland`,
	`Anti-skin cancer shrimp`,
	`A hat that changes in length every time you look at it`,
	`Lady Gaga’s album Born this Way on CD`,
	`bone cancer`,
	`A deck of Uno Cards.`,
	`Brindley`,
	`A baby-sized wyrdwing that keeps saying cunt in the Tongue of Azeker`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`Yaoi paddle`,
	`One gallon of human blood`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`Jar of live wasps`,
	`Lucian Ixtal’s other eye`,
	`My actual irl dog`,
	`VHS containing fat on my roomates door haha`,
	`A fortune cookie with an engagement ring and a note with “Give it to her/him/them ;)” on it`,
	`The current ruler of (pick a country)`,
	`Methamphetamine`,
	`Nativist of your choice gets punched very hard in the face by the wind`,
	`Pica`,
	`Lip balm`,
	`A sunburn`,
	`SERVED!`,
	`DVD copy of glee season one`,
	`Collectible Starbrewer Trading Card! (#4)`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`A splinter from the stake Judith Maywood was burned on`,
	`Very Strong Potion of Instant Bottom Surgery`,
	`Nail polish in your least favorite color`,
	`Very Strong Elixir of Penis Enlargement`,
	`Starbrewer trading card`,
	`Little child who bites you`,
	`Dyslexia`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`Poster with an image sent in the server (pick a number 1-50)`,
	`“I don’t want anymore ice cream” flavored ice cream`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`Pipe bomb and a bag of doritos`,
	`Gender dysphoria`,
	`EVIL ASTRO`,
	`Viscous mucus monster who insists on sticking by your side`,
	`Very Strong Potion of Instant Top Surgery`,
	`The bullet that shot Victor. There is dried blood still on it.`,
	`A bridal bouquet. Do you look inside?`,
	`Fortune cookie that contains a transcript of a random conversation from #general.`,
	`6 oz canister of Old Bay™ Seasoning for Seafood, Poultry, Salads, & Meats`,
	`Skin doritos`,
	`Starbrewer trading card`,
	`Victor`,
	`Ball of 500 ants`,
	`Starbrewer trading card`,
	`North Island Massacre Cat Poster`,
	`A portrait of a very attractive, mostly naked muscular man/woman/enby (roll)`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`A picture of one of your teachers at the Brindley Ball (if they went, if not, embarrassing childhood photo)`,
	`Bundle of Wheat`,
	`15% off coupon for Spencer’s`,
	`A copy of Lupe’s bone collection`,
	`Lesbian thoughts`,
	`What appears to be a fae taxidermy (this should be impossible because the bodies of fae disintegrate upon death)`,
	`A confused but very polite old man with dementia`,
	`A pair of shoes so worn they fall apart if you wear them`,
	`Faewolf scented candle`,
	`Peanut allergy`,
	`The cost of living in (insert country)`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`Orb that makes you witness the actual death of one of your loved ones who has died (if none exist, reroll)`,
	`Chase Sapphire Reserve Credit Card Issued to Michael Joseph Dutton Card number 3010 8273 9120 0299 Expires 2/29 CVV 259`,
	`12 pack of extra strength Charmin toilet paper`,
	`The outside of a chicken breast, like before you cut into the stringy part. Like the isolated smooth outside layer of the chicken breast separate from the stringy meat inside, it's just the outside layer of the chicken breast, cut away from the stringy meat in the center. It doesn't include the stringy part of the meat. It's just the outside of a chicken breast. Not the stringy part, just the outside. Like if you cut into it and take out the stringy inside, you'd just have the outside, that's what you have.`,
	`Yaoi manga`,
	`$25 Panera Bread gift card`,
	`Bullet that will shoot Atlas Wispon in the future`,
	`Fortune cookie that says “boobs”`,
	`Bag of half-eaten naked doritos`,
	`Zac Efron’s obituary`,
	`One dose of MMR (measles, mumps, and rubella) vaccine`,
	`A clone of you made of paper mache that knows you as well as yourself and hates you`,
	`Sargento Sharp Cheddar Cheese`,
	`Maximum Strength Laxative`,
	`A more thorough, empathetic understanding of a loved one of your choice.`,
	`The answers to an upcoming second year exam`,
	`Thick, viscous yellow-green oil`,
	`A homunculus in a bottle who is very keen on staying in the bottle and resents the idea of being asked to leave the bottle`,
	`A cardboard cutout of Billie Joe Armstrong`,
	`Killua Zoldyck`,
	`Childhood photo of a random adult in your life`,
	`A floppy disk containing footage of your birth`,
	`A non newborn human baby. Like… a two year old child. This is definitely someone’s child. They’re like asking for their mom and shit. Uh. Um.`,
	`Plate of scrambled eggs`,
	`Box of lambskin condoms`,
	`A parent’s full name and home address written on a piece of paper`,
	`Saltwater flavored banana bites`,
	`A $45 Texas Roadhouse gift card`,
	`Teleported to (country)`,
	`Pronoun oil`,
	`Astro just punches you in the face`,
	`An old western town where the sun’s too hot to work`,
	`(Character’s) wallet`,
	`A whistle that summons a cat companion to fight by your side! This cat is very old and crusty and walks very slowly. She tires easily so she will have to take regular nap breaks while attempting to come to you. Typically, it takes her anywhere from a day to a week to reach you. Also, she has a lot of medications that she needs to take, so while she’s coming to the location you blew the whistle make sure to find her and give her her medication, ideally around 9 AM though as long as it’s generally around the same time you don’t need to be super strict, except the third one that has to be taken at EXACTLY the same time or it can get dangerous. You should probably bring some cream cheese or tuna with you, she hates the pills and will refuse to eat them if she knows there they’re. You also might need to help her chew, sometimes she forgets. She has weekly vet appointments so if she’s taking the longer amount of time you’ll have to temporarily pause her journey to take her to the vet.`,
	`Your classical school yearbook from when you were 13, which instantly deals 500 psychic damage.`,
	`A human skull… filled with SKITTLES!!!`,
	`A baseball signed by your least favorite person`,
	`An aura of Masculine Thunder`,
	`A random character’s birth certificate`,
	`A yo-yo! Do you throw it?!`,
	`A bath bomb with an actual bomb clock on it set to 5 minutes. It starts beeping once it reaches 0:59 seconds and gets progressively faster.`,
	`A full set of utensils all shaped like bird feet`,
	`Massive cartoon mallet`,
	`Talking like ChatGPT for the next 24 hours`,
	`A fortune cookie containing a deep secret about another character spread like gossip`,
	`The fruit.`,
	`Davey, a cartoon henchman who follows you around and goes “YEAH, BAWSS” to everything you say. If anyone is ever mean to you, he will scream and cry and have a devastating, complete mental breakdown from which he may never recover.`,
	`A piece of Astro’s wisdom. You may request one wisdom. What wisdom do you seek?`,
	`A graduated character’s end of semester letter`,
	`Belladonna and Lucius’s divorce papers`,
	`A random dead character’s obituary`,
	`Instantly teleported to a random (living) character`,
	`Tiny notebook full of bad ideas written in beautiful caligraphy: (Examples)`,
	`Googly eyes! Too many googly eyes. Googly eyes are constantly falling out of your bags and pockets every time you take a step. Don’t slip! (Note: any character who receives this will be cursed for one week)`,
	`A family photo of you and your family and this guy standing next to you`,
	`A fortune cookie that says “You’ll be fine, buddy. Just do your best” signed by one of your parents but not written in their handwriting.`,
	`One signular ravioli wrapped like a gift :)`,
	`A VHS tape that is only black and silent until one audible gasp can be heard`,
	`24 oz bottle of the wine (yes, that wine)`,
	`One of the turtles from the COG garden`,
	`The sensation that you have forgotten something you loved`,
	`Baby ocelot`,
	`Astro comes to your house to live there and set up his shop there for one week. Damn bitch, you live like this?`,
	`A withered, ancient tome, bound together with golden thread, a blue moonstone gem glowing, embeded in the seal. Do you open it?`,
	`Cadbury favourites party edition 470g`,
	`A deck of Uno Cards.`,
	`Calliope Igenmorgenschweissenmann`,
	`A keychain depicting Tove surfing`,
	`DVD copy of Iron Lung`,
	`A mug labeled “World’s Most _____” (According to character)`,
	`Scythian’s scarf`,
	`Hawaiian shirt with a pattern of your own face on it (I know a guy who owns one of these) (it’s awesome)`,
	`Used dentures. As in, dentures that are still being used. Right now.`,
	`A feather from (insert wing squad member here)‘s wings`,
	`A newborn human baby`,
	`Synthetic wig of Scythian’s hair`,
	`Sentient rock that blushes when embarrassed and enjoys being pat on the head`,
	`Bag of teeth labeled “normal teeth”`,
	`A fortune cookie containing a letter addressed to you that says “I just want to let you know I care about you, and I’m thinking about you. You are a wonderful person. Please don’t let this world get you down. -Freaky Lucas.”`,
	`Unopened can of baked beans that expired in 1998`,
	`A fortune cookie with a legally binding NDA inside`,
	`A map that only has directions to all aquariums in Azekereth`,
	`An unnecessary overanalysis of a random garfield comic (prompt: pick a month and a year between 1978 and 2026, then pick a given day.)`,
	`A portrait of you from a timeline where you made (worse/better coin flip) choices`,
	`Corentin’s Ability-Dulling Sunglasses (PLEASE GIVE THEM BACK)`,
	`A fake moustache. Do you put it on?`,
	`USB-C Phone Charger`,
	`A wedding invitation phrased like someone’s cryptic last words.`,
	`Banana with an authoritative aura`,
	`A business card that just says “Do not speak to me ever again.”`,
	`A bottle labeled “All-Purpose Potion” with no listed purposes`,
	`A pillow that is always cold`,
	`Jar of glitter labeled “Mom’s Ashes”`,
	`Your name written in the handwriting of a character you hate`,
	`One of those plastic babies from King Cake`,
	`Soup thermos full of chicken noodle soup and glitter`,
	`Half-knitted scarf knitted by someone going through a divorce`,
	`The sensation of loss`,
	`A book titled *How to Escape.* All the pages are blank.`,
	`Coupon for a free Build-a-Bear`,
	`A bottle of unknown liquid labeled “probably ok to drink”`,
	`Michaelangelo from Teenage Mutant Ninja Turtles (1987)`,
	`Scythian's Glasses`,
	`A BOOK about S*X?! (Note: Not smut, just biology.)`,
	`Certificate naming you honorary Mayor of the north island`,
	`A fortune cookie containing the last words of a dead character.`,
	`A framed photo of you with “ADEQUATE” written in big bold letters`,
	`A locket containing a photo of someone you’ve only seen in dreams`,
	`A flash drive containing only low resolution images of horses`,
	`Extremely sincere apology letter from a goblin`,
	`A backpack. Do you open it?`
	];

const POTIONS = [
  "Elixir of Healing",
  "Elixir of Stamina",
  "Elixir of Mana",
  "Elixir of Resistance",
  "Elixir of Luminosity",
  "Elixir of Youth",
  "Elixir of Strength",
  "Elixir of Joy",
  "Elixir of Springheel",
  "Elixir of Invisibility",
  "Elixir of Rubberflesh",
  "Elixir of Mimicry",
  "Elixir of Charm",
  "Elixir of Ideation",
  "Elixir of the Messenger",
  "Elixir of the Augur",
  "Elixir of Calm",
  "Poison of Paralysis",
  "Poison of Aging",
  "Poison of Poisoning",
  "Poison of Susceptibility",
  "Poison of Honesty",
  "Poison of Dishonesty",
  "Poison of Courage",
  "Poison of Numbing",
  "Poison of Lyricism",
  "Poison of Amnesia",
  "Poison of Somnia",
  "Poison of Blindness",
  "Poison of Deafness",
  "Poison of Up",
  "Poison of Nausea",
  "Poison of Weakness",
  "Poison of Vacancy",
  "Poison of Terror"
];

async function getBigGuyUsers(guild) {
  const role = guild.roles.cache.find(r => r.name === "The Big Guy");
  if (!role) return [];

  return role.members.map(member => member.user);
}

async function dmBigGuys(guild, content) {
  const users = await getBigGuyUsers(guild);

  for (const user of users) {
try {

  // short message
  if (content.length <= 2000) {
    await user.send(content);
  }

  // split long message
  else {

    const chunks = [];

    while (content.length > 1900) {

      let splitIndex = content.lastIndexOf('\n', 1900);

      // fallback if no newline found
      if (splitIndex === -1) {
        splitIndex = 1900;
      }

      chunks.push(content.slice(0, splitIndex));
      content = content.slice(splitIndex);
    }

    if (content.length > 0) {
      chunks.push(content);
    }

    for (const chunk of chunks) {
      await user.send(chunk);
    }
  }

} catch (err) {
      console.error(`Failed to DM ${user.tag}`, err);
    }
  }
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateIngredients(dist) {
  const counts = {
    common: {},
    uncommon: {},
    rare: {}
  };

  function addItem(rarity, item) {
    if (!counts[rarity][item]) {
      counts[rarity][item] = 0;
    }
    counts[rarity][item]++;
  }

  // roll
  for (let i = 0; i < dist.common; i++) {
    addItem('common', getRandomItem(INGREDIENTS.common));
  }

  for (let i = 0; i < dist.uncommon; i++) {
    addItem('uncommon', getRandomItem(INGREDIENTS.uncommon));
  }

  for (let i = 0; i < dist.rare; i++) {
    addItem('rare', getRandomItem(INGREDIENTS.rare));
  }

  return counts;
}

function resolveCharacterName(data, input) {
  const normalized = input.toLowerCase();

  if (data.characters[normalized]) {
    return normalized;
  }

  if (data.aliases?.[normalized]) {
    return data.aliases[normalized];
  }

  return null;
}

function loadData() {
  const data = fs.readFileSync('./data.json', 'utf8');
  return JSON.parse(data);
}

function saveData(data) {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

function formatIngredients(counts) {
  let output = '';

  function addItems(items) {
    for (const item in items) {
      const count = items[item];
      if (count === 1) {
        output += `${item}\n`;
      } else {
        output += `${item} x${count}\n`;
      }
    }
  }

  addItems(counts.common);
  addItems(counts.uncommon);
  addItems(counts.rare);
  if (counts.veryRare) addItems(counts.veryRare);
  return output;
}

function getPotionDistribution(m, n) {
  let veryMild = 0;
  let mild = 0;
  let moderate = 0;

  if (n <= 5) {
    veryMild = m;
  } 
  else if (n <= 9) {
    veryMild = Math.floor(m * 0.80);
    mild = m - veryMild;
  } 
  else if (n <= 15) {
    veryMild = Math.floor(m * 0.60);
    mild = m - veryMild;
  } 
  else if (n <= 19) {
    veryMild = Math.floor(m * 0.20);
    mild = Math.floor(m * 0.40);
    moderate = m - veryMild - mild;
  } 
  else if (n === 20) {
    veryMild = Math.floor(m * 0.05);
    mild = Math.floor(m * 0.15);
    moderate = m - veryMild - mild;
  }

  return { veryMild, mild, moderate };
}

function resolveSpecialPotion(name) {
  if (name === "Elixir of Resistance") {
    const types = [
      "Elemental Resistance",
      "Kinetic Resistance",
      "Mental Resistance",
      "Total Resistance"
    ];
    return `Elixir of ${getRandomItem(types)}`;
  }

  if (name === "Poison of Susceptibility") {
    const types = [
      "Elemental Susceptibility",
      "Kinetic Susceptibility",
      "Mental Susceptibility",
      "Total Susceptibility"
    ];
    return `Poison of ${getRandomItem(types)}`;
  }

  return name;
}

function generatePotions(dist) {
  const counts = {};

  function addItem(name) {
    if (!counts[name]) counts[name] = 0;
    counts[name]++;
  }

  function rollPotion(strength) {
    let potion = getRandomItem(POTIONS);
    potion = resolveSpecialPotion(potion);

    const fullName = `${strength} ${potion}`;
    addItem(fullName);
  }

  for (let i = 0; i < dist.veryMild; i++) {
    rollPotion("Very Mild");
  }

  for (let i = 0; i < dist.mild; i++) {
    rollPotion("Mild");
  }

  for (let i = 0; i < dist.moderate; i++) {
    rollPotion("Moderate");
  }

  return counts;
}

function formatPotions(counts) {
  const order = ["Very Mild", "Mild", "Moderate"];
  const sections = {
    "Very Mild": [],
    "Mild": [],
    "Moderate": []
  };

  // buckets
  for (const item in counts) {
    const count = counts[item];
    const strength = item.startsWith("Very Mild")
      ? "Very Mild"
      : item.startsWith("Mild")
      ? "Mild"
      : "Moderate";

    for (let i = 0; i < count; i++) {
      sections[strength].push(item);
    }
  }

  // build output
  let output = '';

  order.forEach(strength => {
    sections[strength].forEach(item => {
      output += `${item}\n`;
    });
  });

  return output;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

function buildDailyReport(iggy, astro) {
  let report = `# DAILY SHOP REPORT\n\n`;

  report += `**Iggy Ingredients Quantity:** ${iggy.meta.ingredientsQuantity}\n`;
  report += `**Iggy Ingredients Quality:** ${iggy.meta.ingredientsQuality}\n`;
  report += `**Iggy Potions Quantity:** ${iggy.meta.potionsQuantity}\n`;
  report += `**Iggy Potions Quality:** ${iggy.meta.potionsQuality}\n\n`;

  report += `**Astro Ingredients Quantity:** ${astro.meta.ingredientsQuantity}\n`;
  report += `**Astro Ingredients Quality:** ${astro.meta.ingredientsQuality}\n`;
  report += `**Astro Potions Quantity:** ${astro.meta.potionsQuantity}\n`;
  report += `**Astro Potions Quality:** ${astro.meta.potionsQuality}\n`;
  report += `**Astro Bullshit Ingredients:** ${astro.meta.ingBullshitRoll}\n`;
  report += `**Astro Bullshit Potions:** ${astro.meta.potBullshitRoll}\n\n`;

  report += `# ASTRO SCAMS\n\n`;

  if (astro.bullshitLog.length === 0) {
    report += `No scams?!\n`;
  } else {
    astro.bullshitLog.forEach(entry => {
      report += `${entry.original} → ${entry.replacedWith}\n`;
    });
  }

  return report;
}


client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  // DAILY SHOP
  cron.schedule('0 0 * * *', async () => {
    console.log('Generating shops...');

    try {
      const guilds = client.guilds.cache;

      for (const guild of guilds.values()) {
        const channel = guild.channels.cache.find(
          c => c.name === 'ingredients' && c.isTextBased()
        );

        if (!channel) return;

        // unpin
        const pinned = await channel.messages.fetchPinned();
        for (const msg of pinned.values()) {
          await msg.unpin().catch(() => {});
        }

        const data = loadData();

// build shop
if (!data.currentShop) {
  data.currentShop = {};
}

data.currentShop.iggy = buildIggyShop();
data.currentShop.astro = buildAstroShop();

await dmBigGuys(guild, report);

const iggyMsg = await channel.send(
  formatFullShop(data.currentShop.iggy)
);
await iggyMsg.pin();

const astroMsg = await channel.send(
  formatAstroShop(data.currentShop.astro)
);
await astroMsg.pin();

data.shopMessageIds = {
  iggy: iggyMsg.id,
  astro: astroMsg.id
};

        saveData(data);
		}

    } catch (err) {
      console.error('Shop generation failed:', err);
    }
  }, {
    timezone: "America/New_York"
  });

  // token reset
  cron.schedule('59 23 * * 0', () => {
    console.log('Resetting tokens...');

    try {
      const data = loadData();

      for (const charName in data.characters) {
        data.characters[charName].tokens.iggy = 5;
        data.characters[charName].tokens.astro = 5;
      }

      saveData(data);
      console.log('All tokens reset successfully.');

    } catch (err) {
      console.error('Token reset failed:', err);
    }

  }, {
    timezone: "America/New_York"
  });
});

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollIggyStock() {

  const roll = Math.random();

  // 10% tiny stock
  if (roll < 0.10) {
    return Math.floor(Math.random() * 5); // 0-4
  }

  // 80% normal stock
  if (roll < 0.90) {
    return Math.floor(Math.random() * 6) + 5; // 5-10
  }

  // 10% huge stock
  return Math.floor(Math.random() * 10) + 11; // 11-20
}

function generateIggyShop() {

  // quant
  const x = rollIggyStock(); // ingredients
  const m = rollIggyStock(); // potions

  // qual
  const y = rollDie(20);
  const n = rollDie(20);

  return {
    ingredientsQuantity: x,
    potionsQuantity: m,
    ingredientsQuality: y,
    potionsQuality: n
  };
}

function getIngredientDistribution(x, y) {
  let common = 0;
  let uncommon = 0;
  let rare = 0;

  if (y <= 5) {
    common = x;
  } else if (y <= 9) {
    common = Math.floor(x * 0.95);
    uncommon = x - common;
  } else if (y <= 15) {
    common = Math.floor(x * 0.90);
    uncommon = x - common;
  } else if (y <= 19) {
    common = Math.floor(x * 0.85);
    uncommon = x - common;
  } else if (y === 20) {
    common = Math.floor(x * 0.75);
    uncommon = Math.floor(x * 0.15);
    rare = x - common - uncommon;
  }

  return { common, uncommon, rare };
}

function getBullshitModifier(type, tier) {
  if (type === 'ingredient') {
    switch (tier) {
      case 'common': return 0.75;
      case 'uncommon': return 1.0;
      case 'rare': return 1.25;
      case 'veryRare': return 1.6;
      case 'enigmatic': return 2.0;
      default: return 1;
    }
  }

  if (type === 'potion') {
    switch (tier) {
      case 'Very Mild': return 0.6;
      case 'Mild': return 0.85;
      case 'Moderate': return 1.0;
      case 'Strong': return 1.25;
      case 'Very Strong': return 1.6;
      default: return 1;
    }
  }

  return 1;
}

function buildIggyShop() {
  const shop = generateIggyShop();

  const ingDist = getIngredientDistribution(
    shop.ingredientsQuantity,
    shop.ingredientsQuality
  );
  const ingCounts = generateIngredients(ingDist);

  const potDist = getPotionDistribution(
    shop.potionsQuantity,
    shop.potionsQuality
  );
  const potCounts = generatePotions(potDist);

return {
  ingredients: ingCounts,
  potions: potCounts,

meta: {
  ingredientsQuantity: shop.ingredientsQuantity,
  potionsQuantity: shop.potionsQuantity,
  ingredientsQuality: shop.ingredientsQuality,
  potionsQuality: shop.potionsQuality
}
};
}

function formatFullShop(shopData) {
  return (
    `# Welcome to Scythian's student Alchemy shop!\n` +
    `Please have a look around :)\n\n` +
    `(NOTE: DO NOT BUY ANYTHING FROM ASTRO NO MATTER WHAT HE TELLS YOU.)\n\n` +

    `**__Ingredients__**\n` +
    formatIngredients(shopData.ingredients) + '\n' +

    `**__Potions__**\n` +
    formatPotions(shopData.potions)
  );
}

function getBullshitBaseChance(z) {
  if (z === 1) return 0.20;
  if (z <= 5) return 0.40;
  if (z <= 9) return 0.60;
  if (z <= 15) return 0.70;
  if (z <= 19) return 0.80;
  return 0.95;
}

function applyAstroBullshit(counts, type, z) {
  const baseChance = getBullshitBaseChance(z);

  const result = type === 'ingredient' ? {} : {};
  const bullshitLog = [];
  const scamMap = {
    ingredients: {},
    potions: {}
  };

  // =========================
  // INGREDIENTS
  // =========================
  if (type === 'ingredient') {
    for (const tier in counts) {
      result[tier] = {};

      for (const item in counts[tier]) {
        let count = counts[tier][item];

        for (let i = 0; i < count; i++) {
          const modifier = getBullshitModifier(type, tier);
          const tierChance = getTierBullshitChance(type, tier);

          let chance =
            tierChance + (baseChance * modifier - 0.5) * 0.6;

          chance = Math.min(0.99, Math.max(0.05, chance));

          if (Math.random() < chance) {
            const fake = getRandomItem(ASTRO_BULLSHIT_ITEMS);

            if (!scamMap.ingredients[item]) scamMap.ingredients[item] = [];
            scamMap.ingredients[item].push(fake);

            bullshitLog.push({
              original: item,
              replacedWith: fake,
              tier
            });
          }

          if (!result[tier][item]) result[tier][item] = 0;
          result[tier][item]++;
        }
      }
    }
  }

// =========================
// POTIONS
// =========================
else if (type === 'potion') {
  result.all = {};

  for (const item in counts.all) {
    let count = counts.all[item];

    for (let i = 0; i < count; i++) {
      let tier;

      if (item.startsWith("Very Strong")) tier = "Very Strong";
      else if (item.startsWith("Strong")) tier = "Strong";
      else if (item.startsWith("Moderate")) tier = "Moderate";
      else if (item.startsWith("Mild")) tier = "Mild";
      else tier = "Very Mild";

      const modifier = getBullshitModifier(type, tier);
      const tierChance = getTierBullshitChance(type, tier);

      let chance =
        tierChance + (baseChance * modifier - 0.5) * 0.6;

      chance = Math.min(0.99, Math.max(0.05, chance));

      if (Math.random() < chance) {
        const fake = getRandomItem(ASTRO_BULLSHIT_ITEMS);

        if (!scamMap.potions[item]) scamMap.potions[item] = [];
        scamMap.potions[item].push(fake);

        bullshitLog.push({
          original: item,
          replacedWith: fake,
          tier
        });
      }

      if (!result.all[item]) result.all[item] = 0;
      result.all[item]++;
    }
  }
}

  return { counts: result, bullshitLog, scamMap };
}

function buildAstroShop() {
  const ingredientsQuantity = rollDie(25) + 10;
  const potionsQuantity = rollDie(25) + 10;

  const ingredientsQuality = rollDie(20);
  const potionsQuality = rollDie(20);

  const ingDist = getAstroIngredientDistribution(
    ingredientsQuantity,
    ingredientsQuality
  );

  const potDist = getAstroPotionDistribution(
    potionsQuantity,
    potionsQuality
  );

  let ingCounts = generateAstroIngredients(ingDist);
  let potCounts = generateAstroPotions(potDist);

  const ingBullshitRoll = rollDie(20);
  const potBullshitRoll = rollDie(20);

  const ingResult = applyAstroBullshit(ingCounts, 'ingredient', ingBullshitRoll);
  const wrappedPotCounts = { all: potCounts };

const potResultRaw = applyAstroBullshit(
  wrappedPotCounts,
  'potion',
  potBullshitRoll
);

const potResult = {
  counts: potResultRaw.counts.all,
  scamMap: potResultRaw.scamMap,
  bullshitLog: potResultRaw.bullshitLog
};
  
  return {
  ingredients: ingResult.counts,
  potions: potResult.counts,

  scamMap: {
    ingredients: ingResult.scamMap.ingredients,
    potions: potResult.scamMap.potions
  },

  meta: {
    ingredientsQuantity,
    potionsQuantity,
    ingredientsQuality,
    potionsQuality,
    ingBullshitRoll,
    potBullshitRoll
  },


  bullshitLog: [
    ...ingResult.bullshitLog,
    ...potResult.bullshitLog
  ]
};

return {
  ingredients: ingResult.counts,
  potions: potResult.counts,

  scamMap: {
    ingredients: ingResult.scamMap.ingredients,
    potions: potResult.scamMap.potions
  },

  meta: {
    ingredientsQuantity,
    potionsQuantity,
    ingredientsQuality,
    potionsQuality,
    ingBullshitRoll,
    potBullshitRoll
  },

  bullshitLog: [
    ...ingResult.bullshitLog,
    ...potResult.bullshitLog
  ]
};
}

async function sendAstroReceipt(guild, character, purchasedItems) {
  let msg = `# ASTRO TRANSACTION RECEIPT\n\n`;
  msg += `**Customer:** ${character.displayName}\n\n`;
  msg += `**Items Received:**\n`;

  const grouped = {};
  purchasedItems.forEach(item => {
    grouped[item] = (grouped[item] || 0) + 1;
  });

  for (const item in grouped) {
    const count = grouped[item];
    msg += count > 1 ? `${item} x${count}\n` : `${item}\n`;
  }

  await dmBigGuys(guild, msg);
}

function formatAstroIngredients(counts) {
  let output = '';

  function addItems(items) {
    for (const item in items) {
      const count = items[item];
      output += count > 1 ? `${item} x${count}\n` : `${item}\n`;
    }
  }

  addItems(counts.common);
  addItems(counts.uncommon);
  addItems(counts.rare);
  if (counts.veryRare) addItems(counts.veryRare);

  return output;
}

function formatAstroPotions(counts) {
  const order = ["Mild", "Moderate", "Strong", "Very Strong"];

  const sections = {
    "Mild": [],
    "Moderate": [],
    "Strong": [],
    "Very Strong": []
  };

  for (const item in counts) {
    const count = counts[item];

    let strength;
    if (item.startsWith("Very Strong")) strength = "Very Strong";
    else if (item.startsWith("Strong")) strength = "Strong";
    else if (item.startsWith("Moderate")) strength = "Moderate";
    else strength = "Mild";

    for (let i = 0; i < count; i++) {
      sections[strength].push(item);
    }
  }

  let output = '';

  order.forEach(strength => {
    sections[strength].forEach(item => {
      output += `${item}\n`;
    });
  });

  return output;
}

function formatAstroShop(shopData) {
  return (
    `# WoLKOM ASTRO SHOP\n` +
    `PLEADS GIVE ME Mmoeny :)\n\n` +

    `ALL ITEMS 100% DO STUFF GUARANTREE\n\n` +

    `**__Ingredients__**\n` +
    formatAstroIngredients(shopData.ingredients) + '\n' +

    `**__Potions__**\n` +
    formatAstroPotions(shopData.potions)
  );
}

function buildIggyReport(shop) {
  return (
    `# IGGY SHOP REPORT\n\n` +

    `**Iggy Ingredients Quantity:** ${shop.meta.ingredientsQuantity}\n` +
    `**Iggy Ingredients Quality:** ${shop.meta.ingredientsQuality}\n` +
    `**Iggy Potions Quantity:** ${shop.meta.potionsQuantity}\n` +
    `**Iggy Potions Quality:** ${shop.meta.potionsQuality}\n`
  );
}

function buildAstroReport(shop) {
  let report =
    `# ASTRO SHOP REPORT\n\n` +

    `**Astro Ingredients Quantity:** ${shop.meta.ingredientsQuantity}\n` +
    `**Astro Ingredients Quality:** ${shop.meta.ingredientsQuality}\n` +
    `**Astro Potions Quantity:** ${shop.meta.potionsQuantity}\n` +
    `**Astro Potions Quality:** ${shop.meta.potionsQuality}\n` +
    `**Astro Bullshit Ingredients:** ${shop.meta.ingBullshitRoll}\n` +
    `**Astro Bullshit Potions:** ${shop.meta.potBullshitRoll}\n\n`;

  report += `# Bullshit Items\n\n`;

  if (shop.bullshitLog.length === 0) {
    report += `None today.\n`;
  } else {
    shop.bullshitLog.forEach(entry => {
      report +=
        `${entry.original} -> ${entry.replacedWith}\n`;
    });
  }

  return report;
}



function getAstroIngredientDistribution(w, y) {
  let common = 0;
  let uncommon = 0;
  let rare = 0;
  let veryRare = 0;

  if (y === 1) {
    common = Math.floor(w * 0.90);
    uncommon = w - common;
  } 
  else if (y <= 5) {
    common = Math.floor(w * 0.80);
    uncommon = Math.floor(w * 0.10);
    rare = w - common - uncommon;
  } 
  else if (y <= 9) {
    common = Math.floor(w * 0.60);
    uncommon = Math.floor(w * 0.20);
    rare = w - common - uncommon;
  } 
  else if (y <= 15) {
    common = Math.floor(w * 0.40);
    uncommon = Math.floor(w * 0.25);
    rare = Math.floor(w * 0.30);
    veryRare = w - common - uncommon - rare;
  } 
  else if (y <= 19) {
    common = Math.floor(w * 0.20);
    uncommon = Math.floor(w * 0.30);
    rare = Math.floor(w * 0.40);
    veryRare = w - common - uncommon - rare;
  } 
  else if (y === 20) {
    common = Math.floor(w * 0.10);
    uncommon = Math.floor(w * 0.15);
    rare = Math.floor(w * 0.50);
    veryRare = w - common - uncommon - rare;
  }

  return { common, uncommon, rare, veryRare };
}

function getAstroPotionDistribution(m, n) {
  let mild = 0;
  let moderate = 0;
  let strong = 0;
  let veryStrong = 0;

  if (n === 1) {
    mild = Math.floor(m * 0.90);
    moderate = m - mild;
  } 
  else if (n <= 5) {
    mild = Math.floor(m * 0.80);
    moderate = Math.floor(m * 0.10);
    strong = m - mild - moderate;
  } 
  else if (n <= 9) {
    mild = Math.floor(m * 0.60);
    moderate = Math.floor(m * 0.20);
    strong = m - mild - moderate;
  } 
  else if (n <= 15) {
    mild = Math.floor(m * 0.40);
    moderate = Math.floor(m * 0.25);
    strong = Math.floor(m * 0.30);
    veryStrong = m - mild - moderate - strong;
  } 
  else if (n <= 19) {
    mild = Math.floor(m * 0.20);
    moderate = Math.floor(m * 0.30);
    strong = Math.floor(m * 0.40);
    veryStrong = m - mild - moderate - strong;
  } 
  else if (n === 20) {
    mild = Math.floor(m * 0.10);
    moderate = Math.floor(m * 0.15);
    strong = Math.floor(m * 0.50);
    veryStrong = m - mild - moderate - strong;
  }

  return { mild, moderate, strong, veryStrong };
}

function generateAstroIngredients(dist) {
  const counts = {
    common: {},
    uncommon: {},
    rare: {},
    veryRare: {}
  };

  function addItem(rarity, item) {
    if (!counts[rarity][item]) {
      counts[rarity][item] = 0;
    }
    counts[rarity][item]++;
  }

  // normal rolls
  for (let i = 0; i < dist.common; i++) {
    addItem('common', getRandomItem(INGREDIENTS.common));
  }

  for (let i = 0; i < dist.uncommon; i++) {
    addItem('uncommon', getRandomItem(INGREDIENTS.uncommon));
  }

  for (let i = 0; i < dist.rare; i++) {
    addItem('rare', getRandomItem(INGREDIENTS.rare));
  }

  for (let i = 0; i < dist.veryRare; i++) {
    addItem('veryRare', getRandomItem(INGREDIENTS["veryRare"]));
  }

  if (Math.random() < 0.01) { 
    addItem('veryRare', getRandomItem(INGREDIENTS.enigmatic));
  }

  return counts;
}

function getTierBullshitChance(type, tier) {
  if (type === 'ingredient') {
    switch (tier) {
      case 'common': return 0.30;
      case 'uncommon': return 0.60;
      case 'rare': return 0.90;
      case 'veryRare': return 0.96;
      case 'enigmatic': return 0.999; // Blood of the Aether
      default: return 0;
    }
  }

  if (type === 'potion') {
    switch (tier) {
      case 'Very Mild': return 0.30;
      case 'Mild': return 0.50;
      case 'Moderate': return 0.60;
      case 'Strong': return 0.70;
      case 'Very Strong': return 0.90;
      default: return 0;
    }
  }
    return 0;
}

function generateAstroPotions(dist) {
  const counts = {};

  function addItem(name) {
    if (!counts[name]) counts[name] = 0;
    counts[name]++;
  }

  function rollPotion(strength) {
    let potion = getRandomItem(POTIONS);
    potion = resolveSpecialPotion(potion);

    const fullName = `${strength} ${potion}`;
    addItem(fullName);
  }

  for (let i = 0; i < dist.mild; i++) {
    rollPotion("Mild");
  }

  for (let i = 0; i < dist.moderate; i++) {
    rollPotion("Moderate");
  }

  for (let i = 0; i < dist.strong; i++) {
    rollPotion("Strong");
  }

  for (let i = 0; i < dist.veryStrong; i++) {
    rollPotion("Very Strong");
  }

  return counts;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // ping cmd
if (command === 'boom') {

  const data = loadData();

  const uniqueCharacters = [];

  const seen = new Set();

  for (const key in data.characters) {

    const character = data.characters[key];

    // prevent first-name aliases from duplicating
    if (seen.has(character.displayName)) continue;

    seen.add(character.displayName);
    uniqueCharacters.push(character.displayName);
  }

  if (uniqueCharacters.length === 0) {
    return message.reply('You are safe for now.');
  }

  const randomCharacter =
    uniqueCharacters[
      Math.floor(Math.random() * uniqueCharacters.length)
    ];

  return message.reply(`**${randomCharacter}** has died.`);
}

if (command === 'commands') {
  return message.reply(
`**alc!tutorial**
Gives you a tutorial on how to sign up for and use Shopsbot.


**alc!register (Character Name)**
Registers a character to the ledger. You can enter anything here, but make sure when using other commands you use the name you entered (though its not case sensitive, and you can just use their first name instead of first and last.) You must be registered to buy from the shops.


**alc!tokens**
Returns how many tokens all your registered characters have. Tokens reset every Sunday at 11:59 EST.


**alc!tokens (Character Name)**
Returns how many tokens your character has for this week. Tokens reset every Sunday at 11:59 EST.


**alc!buy iggy (Character Name)**
Buys however many items you want (and can afford) from Iggy’s shop.


**alc!buy astro (Character Name)**
Buys however many items you want (and can afford) from Astro’s shop.`
  );
}

// yap cmd
if (command === 'yap') {

  const text = args.join(' ');

  if (!text) {
    return message.reply('⚠️ Please provide a message to yap.');
  }

  let success = 0;

  for (const guild of client.guilds.cache.values()) {

    const channel = guild.channels.cache.find(
      c =>
        c.name === 'ingredients' &&
        c.isTextBased()
    );

    if (!channel) continue;

    try {
      await channel.send(text);
      success++;
    } catch (err) {
      console.error(`Failed to yap in ${guild.name}:`, err);
    }
  }

  return message.reply(
    `✅ Yapped in ${success} guild(s).`
  );
}

// tutorial cmd
if (command === 'tutorial') {

  return message.reply(
`# Welcome to Shopsbot!

Hello, I am Shopsbot :) I was made to make the alchemy system a little easier. Here’s a quick tutorial on how to use me!

*Note: Please be patient with me! I’m still in development.*

## Step 1: Registering Characters

Use \`alc!register [character name]\` to register your character in the token ledger. Example:

\`alc!register Parappa the Rapper\`

(Note: When using future commands, you can use just your character’s first name if you want, but make sure to spell it correctly! Your character will start out with 5 tokens when registered. You can use \`alc!tokens\` to view all your registered character’s tokens, or \`alc!tokens [name]\` to check a specific character’s tokens.)

## Step 2: Buying Items

As Shopsbot, I make life so so so so so much easier. However, I do make one thing a bit more inconvenient – You’ll have to be careful with formatting. Items are not case sensitive, but otherwise you’ll have to make sure you’re typing exactly as is! If you’re on desktop, I highly recommend just copy and pasting from the list. I am but a mere Discord Bot and not very smart, please be very specific about what you want.

To buy from Iggy’s shop, type:
\`alc!buy iggy [name]\`

To buy from Astro’s shop, type:
\`alc!buy astro [name]\`

## Good Formatting (yay yay yay!!)

> alc!buy iggy Parappa the Rapper
> Tin
> Mild Poison of Poisoning

> alc!buy astro parappa
> tin
> mild poison of poisoning

## Bad Formatting (i will kill myself :( )

> alc!buy rapping paper dog
> ten
> mildew poison

> alc!buy Parappa the Rapper
> - Tin
> - Mild Poison of Poisoning

> alc!buy Parappa the Rapper Tin Mild Poison of Poisoning

Once you’ve got your formatting down, you’re good to go! For Iggy purchases, you will receive your order immediately. For Astro purchases, those still have to go through Ezra due to the amount of improv involved, so you will receive your order as soon as he can get to it.`
  );
}

  // register cmd
  if (command === 'register') {
	const rawName = args.join(' ');
	const name = rawName.toLowerCase();

    if (!name) {
      return message.reply('⚠️ Please provide a character name. Example: alc!register The Butthole Man');
    }

    const data = loadData();
	if (!data.characters) {
  data.characters = {};
}

    if (data.characters[name]) {
      return message.reply('⚠️ That character is already registered.');
    }

const characterData = {
  displayName: rawName,
  ownerId: message.author.id,
  tokens: {
    iggy: 5,
    astro: 5
  },
  inventory: []
};

data.characters[name] = characterData;

// first name

if (!data.aliases) {
  data.aliases = {};
}

const splitName = name.split(' ');

if (splitName.length > 1) {
  const firstName = splitName[0];

  // only create alias if unused
  if (!data.aliases[firstName]) {
    data.aliases[firstName] = name;
  }
}
    saveData(data);

	message.reply(`**${rawName}** registered successfully. Thank you for your patronage.`);
  }
  
  // tokens cmd
if (command === 'tokens') {
  const data = loadData();

  const name = args.join(' ').toLowerCase();

  // name
  if (name) {
    const character = data.characters[name];

    if (!character) {
      return message.reply('⚠️ Who the fuck is that');
    }

    // restrict
    if (character.ownerId !== message.author.id) {
      return message.reply(`⚠️ Not your character. Don't be nosy.`);
    }

    return message.reply(
      `**${character.displayName}**'s Tokens:\nIggy: ${character.tokens.iggy}\nAstro: ${character.tokens.astro}`
    );
  }

  // all
  const userCharacters = Object.values(data.characters).filter(
    (char) => char.ownerId === message.author.id
  );

  if (userCharacters.length === 0) {
    return message.reply('⚠️ You have no registered characters.');
  }

  let reply = '**Your Tokens:**\n';

  userCharacters.forEach((char) => {
    reply += `\n**${char.displayName}**\nIggy: ${char.tokens.iggy} | Astro: ${char.tokens.astro}\n`;
  });

  message.reply(reply);
}

// iggy cmd
if (command === 'iggy') {
  const data = loadData();

  if (!data.currentShop) {
    data.currentShop = {};
  }

  data.currentShop.iggy = buildIggyShop();

 await dmBigGuys(
  message.guild,
  buildIggyReport(data.currentShop.iggy)
);

  const msg = await message.channel.send(
    formatFullShop(data.currentShop.iggy)
  );

  await msg.pin().catch(console.error);

  if (!data.shopMessageIds) {
    data.shopMessageIds = {};
  }

  data.shopMessageIds.iggy = msg.id;

  saveData(data);
}

function resolveCharacterName(data, input) {
  const normalized = input.toLowerCase();

  if (data.characters[normalized]) {
    return normalized;
  }

  if (data.aliases?.[normalized]) {
    return data.aliases[normalized];
  }

  return null;
}

// astro cmd
if (command === 'astro') {
  const data = loadData();

  if (!data.currentShop) {
    data.currentShop = {};
  }

  data.currentShop.astro = buildAstroShop();

await dmBigGuys(
  message.guild,
  buildAstroReport(data.currentShop.astro)
);

  const msg = await message.channel.send(
    formatAstroShop(data.currentShop.astro)
  );

  await msg.pin().catch(console.error);

  if (!data.shopMessageIds) {
    data.shopMessageIds = {};
  }

  data.shopMessageIds.astro = msg.id;

  saveData(data);
}

// kill cmd
if (command === 'kill') {

  const data = loadData();

  const name = args.join(' ').toLowerCase();

  if (!name) {
    return message.reply(
      '⚠️ Please provide a character name.'
    );
  }

  const character = data.characters[name];

  if (!character) {
    return message.reply(
      '⚠️ Who the fuck is that'
    );
  }

  const displayName = character.displayName;

  delete data.characters[name];

  saveData(data);

  return message.reply(
    `${displayName} was shot to death by COG. [billie eilish meow meow meow song plays]`
  );
}

// wipe data cmd
if (command === 'wipedata') {

  const wipedData = {
    characters: {},
    aliases: {},
    currentShop: {},
    shopMessageIds: {}
  };

  saveData(wipedData);

  return message.reply(
    'data.json has been wiped.'
  );
}

// buy cmd
if (command === 'buy') {
  const data = loadData();

  const firstLine = message.content.split('\n')[0];
const firstArgs = firstLine.slice(prefix.length).trim().split(/ +/);

const shopName = firstArgs[1]?.toLowerCase();
const characterName = firstArgs.slice(2).join(' ').toLowerCase();

  if (!shopName || !['iggy', 'astro'].includes(shopName)) {
    return message.reply(`⚠️ I don't think that person sells alchemy ingredients.`);
  }

  if (!characterName) {
    return message.reply(`⚠️ Please enter your character's name.`);
  }

  const resolvedName =
  resolveCharacterName(data, characterName);

const character =
  resolvedName
    ? data.characters[resolvedName]
    : null;

  if (!character) {
    return message.reply(`⚠️ Who the fuck is that`);
  }

  if (character.ownerId !== message.author.id) {
    return message.reply(`⚠️ ????? That's not your character???`);
  }

  if (!data.currentShop?.[shopName]) {
    return message.reply(`⚠️ That shop isn't open right now. Which um is not good lol if you're getting this message I may be broken`);
  }

  const shop = data.currentShop[shopName];

  // purchase lines
  const lines = message.content.split('\n').slice(1);

  if (lines.length === 0) {
    return message.reply(`⚠️ Please list items on their own line.`);
  }

  const purchasedItems = [];
  let totalCost = 0;

  function normalize(str) {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
  }

function findItem(inputName, shopSection) {
  const normalizedInput = normalize(inputName);

  // flat object (potions)
  const firstValue = Object.values(shopSection)[0];

  const isNested =
    firstValue &&
    typeof firstValue === 'object' &&
    !Array.isArray(firstValue);

  // INGREDIENTS
  if (isNested) {
    for (const tier in shopSection) {
      for (const item in shopSection[tier]) {
        if (normalize(item) === normalizedInput) {
          return {
            item,
            tier
          };
        }
      }
    }
  }

  // POTIONS
  else {
    for (const item in shopSection) {
      if (normalize(item) === normalizedInput) {
        return {
          item
        };
      }
    }
  }

  return null;
}

for (let rawLine of lines) {
  rawLine = rawLine.trim();
  if (!rawLine) continue;

  const match = rawLine.match(/(.+?)\s*x(\d+)$/i);

  let itemName = rawLine;
  let quantity = 1;

  if (match) {
    itemName = match[1].trim();
    quantity = parseInt(match[2]);
  }

  // =========================
  // INGREDIENTS
  // =========================

  const ingredientResult = findItem(itemName, shop.ingredients);

  if (ingredientResult) {
    const actualName = ingredientResult.item;
    const tier = ingredientResult.tier;

    if (shop.ingredients[tier][actualName] < quantity) {
      return message.reply(`⚠️ Not enough ${actualName} in stock.`);
    }

    shop.ingredients[tier][actualName] -= quantity;

    if (shop.ingredients[tier][actualName] <= 0) {
      delete shop.ingredients[tier][actualName];
    }

    for (let i = 0; i < quantity; i++) {
      let finalItem = actualName;

      if (shopName === 'astro') {
        const scamList =
          data.currentShop.astro.scamMap.ingredients?.[actualName];

        if (scamList && scamList.length > 0) {
          finalItem = scamList.shift();
        }
      }

      purchasedItems.push(finalItem);
    }

    totalCost += quantity;
    continue;
  }

  // =========================
  // POTIONS
  // =========================

  const potionResult = findItem(itemName, shop.potions);

  if (potionResult) {
    const actualName = potionResult.item;

    if (shop.potions[actualName] < quantity) {
      return message.reply(`⚠️ Not enough ${actualName} in stock.`);
    }

    shop.potions[actualName] -= quantity;

    if (shop.potions[actualName] <= 0) {
      delete shop.potions[actualName];
    }

    for (let i = 0; i < quantity; i++) {
      let finalItem = actualName;

      if (shopName === 'astro') {
        const scamList =
          data.currentShop.astro.scamMap.potions?.[actualName];

        if (scamList && scamList.length > 0) {
          finalItem = scamList.shift();
        }
      }

      purchasedItems.push(finalItem);
    }

    totalCost += quantity;
    continue;
  }

  return message.reply(
    `I don't recognize "${itemName}". Please type the item name exactly (non-case sensitive) or copy and paste, I am but a lowly discord bot and very stupid.`
  );
}

// token type
const tokenType = shopName === 'astro'
  ? 'astro'
  : 'iggy';

// affordability check
if (character.tokens[tokenType] < totalCost) {
  return message.reply(
    `⚠️ ${character.displayName} can't afford that. They have ${character.tokens[tokenType]} tokens.`
  );
}

// deduct
character.tokens[tokenType] -= totalCost;

// save changes
saveData(data);

const messageId = data.shopMessageIds?.[shopName];

if (messageId) {
  try {
    const channel = message.channel;
    const shopMessage = await channel.messages.fetch(messageId);

    const updatedContent =
      shopName === 'iggy'
        ? formatFullShop(shop)
        : formatAstroShop(shop);

    await shopMessage.edit(updatedContent);
  } catch (err) {
    console.error(`Failed to update ${shopName} shop message:`, err);
  }
}

// receipt
if (shopName === 'astro') {
  await sendAstroReceipt(message.guild, character, purchasedItems);

  saveData(data);

  return message.reply(
    `# Thank you for your purchase!\nYou will receive your order shortly.`
  );
}

  // response
  let reply = `# Thank you for your purchase!\nYou have received:\n\n`;

  const grouped = {};
  purchasedItems.forEach(item => {
    grouped[item] = (grouped[item] || 0) + 1;
  });

  for (const item in grouped) {
    const count = grouped[item];
    reply += count > 1 ? `${item} x${count}\n` : `${item}\n`;
  }

  message.reply(reply);
}
});

client.login(process.env.TOKEN);