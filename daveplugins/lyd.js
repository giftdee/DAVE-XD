const { zokou } = require('../framework/zokou');

// Variable to enable or disable the "idea" command
const isIdeaCommandEnabled = true;

zokou({
  nomCom: "lydea", // Command name
  categorie: "AI", // Category: AI
  reaction: "🧜",   // Emoji shown on trigger
  active: isIdeaCommandEnabled
}, async (dest, zk, commandeOptions) => {

  const { ms, arg, repondre } = commandeOptions;
  const message = arg.join(' ');

  // Greeting messages
  const greetings = ["Hello!", "Hi there!", "Greetings!", "Hey!", "Nice to see you!"];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Introduction phrases
  const introduction = [
    "I'm Assistant, a helpful bot. I'm here to assist you with any questions or tasks you have.",
    "Welcome! I'm Assistant, your friendly bot here to help you with anything you need.",
    "Hi! I'm Assistant, your personal AI assistant. How can I assist you today?",
    "Greetings! I'm Assistant, ready to assist you with your queries and tasks."
  ];
  const randomIntroduction = introduction[Math.floor(Math.random() * introduction.length)];

  // Project suggestions
  const projet = [
    "You should start a new project related to your passion!",
    "How about working on a creative project that excites you?",
    "Consider starting a project that aligns with your interests and goals.",
    "Why not embark on a project that challenges and inspires you?"
  ];
  const randomProjet = projet[Math.floor(Math.random() * projet.length)];

  // Present-moment suggestions
  const presentement = [
    "Currently, you could learn a new skill or hobby.",
    "Right now, you might explore new books or movies.",
    "At the moment, you could try practicing mindfulness or meditation.",
    "Presently, you could focus on improving your physical fitness."
  ];
  const randomPresentement = presentement[Math.floor(Math.random() * presentement.length)];

  // Custom response for the "idea" command when it's enabled
  const customResponse = `This is a custom response for the 'idea' command when it is enabled.
Generated on ${new Date().toLocaleString()}.`;

  // Check if "idea" command is enabled
  if (isIdeaCommandEnabled) {
    // Add a 60-second delay before replying
    setTimeout(() => {
      repondre(customResponse);
    }, 60000); // 60 seconds
  } else {
    // Inform user that the command is disabled
    repondre("Sorry, the 'idea' command is currently disabled.");
    return;
  }

  // Respond based on message content
  if (message.includes('project')) {
    repondre(` ${randomGreeting} ${randomProjet} ${randomIntroduction}`);
  } else if (message.includes('book')) {
    repondre(` ${randomGreeting} How about writing a book on a topic you're knowledgeable about? ${randomIntroduction}`);
  } else if (message.includes('trip') || message.includes('travel')) {
    repondre(` ${randomGreeting} Plan a trip to a destination you've always wanted to visit! ${randomIntroduction}`);
  } else if (message.includes('presentement')) {
    repondre(` ${randomGreeting} ${randomPresentement} ${randomIntroduction}`);
  } else {
    repondre(` ${randomGreeting} I have an idea for you, but I need more information. Could you provide more details? ${randomIntroduction}`);
  }
});
