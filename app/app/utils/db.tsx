import { createClient } from '@supabase/supabase-js'
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import OpenAI from "openai";
// Replace with your Supabase project URL and Anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Type definition for the personality template JSON structure
export type PersonalityTemplate = {
  personalInfo: {
    name: {
      firstName: string | null;
      lastName: string | null;
      preferredName: string | null;
    };
    dateOfBirth: string | null;
    dateOfPassing: string | null;
    gender: string | null;
    contact: {
      email: string | null;
      phone: string | null;
    };
    residence: {
      street: string | null;
      city: string | null;
      state: string | null;
      country: string | null;
      postalCode: string | null;
    };
  };
  traits: {
    personality: {
      mbti: string | null;
      strengths: Array<string | null>;
      challenges: Array<string | null>;
    };
    interests: Array<string | null>;
    values: Array<string | null>;
    mannerisms: Array<string | null>;
  };
  favorites: {
    colors: Array<string | null>;
    foods: Array<string | null>;
    movies: Array<string | null>;
    books: Array<string | null>;
    music: {
      genres: Array<string | null>;
      artists: Array<string | null>;
    };
  };
  education: {
    degree: string | null;
    university: string | null;
    graduationYear: number | null;
  };
  career: {
    currentPosition: string | null;
    company: string | null;
    yearsOfExperience: number | null;
    skills: Array<string | null>;
  };
  languages: Array<{
    name: string | null;
    proficiency: string | null;
  }>;
  memories: {
    significantEvents: Array<string | null>;
    sharedExperiences: Array<string | null>;
    familyMembers: Array<string | null>;
    personalStories: Array<string | null>;
  };
  relationships: {
    family: Array<{
      name: string | null;
      relation: string | null;
      details: string | null;
    }>;
    friends: Array<{
      name: string | null;
      details: string | null;
    }>;
  };
};



if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const Db = createClient(supabaseUrl, supabaseAnonKey)
export const Server = process.env.NEXT_METALOOT_SERVER || ""
export const FrontEnd = process.env.NEXT_FRONT_END_URL || "http://localhost:3000"
export const PrivateKey = process.env.NEXT_PRIVATE_KEY || "123123"
// Helper function to check if a value exists in the database
export const VerfifyUser = async (username: string) => {
  try {
    // Clean up username (remove @ and get just the username)
    const cleanUsername = username.replace('@', '').split('/').pop() || '';

    const response = await fetch(`https://x.com/${cleanUsername}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      mode: 'cors', // You might also try 'no-cors'
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const html = await response.text();

    // Check if the profile exists by looking for specific elements or metadata
    const profileExists = !html.includes('This account doesn\'t exist');

    if (profileExists) {
      return {
        username: cleanUsername,
        url: `https://x.com/${cleanUsername}`,
        exists: true
      };
    }

    return null;

  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Define TypeScript interfaces for the personality structure
interface PersonalityType {
  personalInfo: {
    name: {
      firstName: string;
      lastName: string;
      preferredName: string;
    };
    dateOfBirth: string;
    dateOfPassing?: string;
    gender: string;
    contact: {
      email: string;
      phone: string;
    };
    residence: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  traits: {
    personality: {
      mbti: string;
      strengths: string[];
      challenges: string[];
    };
    interests: string[];
    values: string[];
    mannerisms: string[];
  };
  favorites: {
    colors: string[];
    foods: string[];
    movies: string[];
    books: string[];
    music: {
      genres: string[];
      artists: string[];
    };
  };
  education: {
    degree: string;
    university: string;
    graduationYear: number;
  };
  career: {
    currentPosition: string;
    company: string;
    yearsOfExperience: number;
    skills: string[];
  };
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  memories: {
    significantEvents: string[];
    sharedExperiences: string[];
    familyMembers: string[];
    personalStories: string[];
  };
  relationships: {
    family: Array<{
      name: string;
      relation: string;
      details: string;
    }>;
    friends: Array<{
      name: string;
      details: string;
    }>;
  };
}

// Fetch personality from URL with fallback to default
export async function fetchPersonality(url: string): Promise<PersonalityType> {
  try {
    // URL to fetch personality data from
    const personalityUrl = url || 'https://your-default-url.com/personality.json';
    
    const response = await fetch(personalityUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch personality data: ${response.status} ${response.statusText}`);
      return defaultPersonality;
    }
    
    const personalityData = await response.json();
    console.log("response", personalityData);
    return personalityData as PersonalityType;
  } catch (error) {
    console.error('Error fetching personality data:', error);
    return defaultPersonality;
  }
}

// Default personality to use if fetching fails
const defaultPersonality: PersonalityType = {
  "personalInfo": {
    "name": {
      "firstName": "H",
      "lastName": "T",
      "preferredName": "H"
    },
    "dateOfBirth": "1990-05-15",
    "dateOfPassing": "2023-08-12",
    "gender": "Male",
    "contact": {
      "email": "john.doe@email.com",
      "phone": "+1-555-123-4567"
    },
    "residence": {
      "street": "222/6 Bui Dinh Tuy Street",
      "city": "Ho Chi Minh",
      "state": "Binh Thanh",
      "country": "Vietnam",
      "postalCode": "700000"
    }
  },
  "traits": {
    "personality": {
      "mbti": "ENTJ",
      //       INFJ: The Advocate
      // INFP: The Mediator
      // INTJ: The Architect
      // INTP: The Thinker
      // ISFJ: The Defender
      // ISFP: The Artist
      // ISTJ: The Logistician
      // ISTP: The Virtuoso
      // ENFJ: The Protagonist
      // ENFP: The Campaigner
      // ENTJ: The Commander
      // ENTP: The Debater
      // ESFJ: The Consul
      // ESFP: The Entertainer
      // ESTJ: The Executive
      // ESTP: The Entrepreneur
      "strengths": [
        "Sacartistic",
        "Determined",
        "Unpredictable",
        "Unorganized",
        "Hot-headed",
        "Aggressive",
        "Self-centered",
        "Self-absorbed",
        "Self-important"
      ],
      "challenges": [
        "Overthinking",
        "Overly emotional",
        "Overly sensitive",
        "Overly dramatic"
      ]
    },
    "interests": [
      "Photography",
      "Souverneignity",
      "Singing",
      "Online Chatting",
      "Shoppe",
      "Online Shopping"
    ],
    "values": [
      "Respect",
      "Food",
      "Entertainment",
    ],
    "mannerisms": [
      "Often used the phrase 'ủa vậy à...'",
      "Laughed sarcastically before saying :'biết ngay mà'",
    ]
  },
  "favorites": {
    "colors": [
      "Blue",
      "Forest green"
    ],
    "foods": [
      "Vietnamese cuisine",
      "Japanese cuisine",
    ],
    "movies": [
      "The Shawshank Redemption",
      "Inception",
      "The Grand Budapest Hotel"
    ],
    "books": [
      "1984",
      "The Alchemist",
      "Dune"
    ],
    "music": {
      "genres": [
        "Jazz",
        "Classical",
        "Alternative rock"
      ],
      "artists": [
        "Miles Davis",
        "Beethoven",
        "Radiohead"
      ]
    }
  },
  "education": {
    "degree": "Master's in Computer Science",
    "university": "Stanford University",
    "graduationYear": 2015
  },
  "career": {
    "currentPosition": "Senior Software Engineer",
    "company": "Tech Innovations Inc.",
    "yearsOfExperience": 8,
    "skills": [
      "JavaScript",
      "Python",
      "Cloud Architecture",
      "System Design"
    ]
  },
  "languages": [
    {
      "name": "Vietnamese",
      "proficiency": "Native"
    }
  ],
  "memories": {
    "significantEvents": [
      "Our wedding day in Napa Valley, 2015",
      "The birth of our daughter Yen in 2018",
      "That summer road trip along the Pacific Coast Highway",
      "When we got caught in the rainstorm at the music festival"
    ],
    "sharedExperiences": [
      "Our Sunday morning coffee ritual on the porch",
      "Weekly game nights with the Johnsons",
      "Our first apartment together with the broken heater",
      "Teaching each other our favorite hobbies"
    ],
    "familyMembers": [
      "Emma - our daughter",
      "Mom (Sarah) and Dad (Robert)",
      "Your parents, who I grew to love like my own",
      "My brother Michael and his family"
    ],
    "personalStories": [
      "The time I got lost hiking and ended up discovering that beautiful waterfall",
      "How I learned to cook from my grandmother",
      "My first job interview disaster that actually led to my career",
      "The childhood dog that inspired my love of animals"
    ]
  },
  "relationships": {
    "family": [
      {
        "name": "Bơ",
        "relation": "Son",
        "details": "Born October 10, 1996. He is a very dedicate and hard working. He's the only one who i can rely on doing anything. I'm always being tough."
      },
      {
        "name": "Sarah",
        "relation": "Mother",
        "details": "Always supportive of my creative pursuits. Taught me to bake those cookies you love."
      }
    ],
    "friends": [
      {
        "name": "David",
        "details": "My college roommate. We stayed close all these years. He was the best man at our wedding."
      },
      {
        "name": "Jennifer",
        "details": "We worked together at Tech Innovations. She introduced us at that company party, remember?"
      }
    ]
  }
};

export default async function processCommand(transcript: string): Promise<string> {
  console.log("processing command");
  if (!transcript.trim()) return "";

  try {
    // Fetch personality data from URL instead of using default directly
    let personality = await fetchPersonality("https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//boHoang.json");

    // Initialize OpenAI model through LangChain
    // const model = new ChatOpenAI({
    //   temperature: 0.2, // Increased for more creative/varied responses
    //   modelName: 'gpt-4o-mini',
    //   openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    // });
  
    // Format personality data for the prompt
    const name = personality.personalInfo.name.preferredName;
    const dateOfPassing = personality.personalInfo.dateOfPassing;
    const strengths = personality.traits.personality.strengths.map(s => `- ${s}`).join('\n');
    const challenges = personality.traits.personality.challenges.map(c => `- ${c}`).join('\n');
    const mannerisms = personality.traits.mannerisms.map(m => `- ${m}`).join('\n');
    const values = personality.traits.values.map(v => `- ${v}`).join('\n');
    const interests = personality.traits.interests.map(i => `- ${i}`).join('\n');
    const significantMemories = personality.memories.significantEvents.map(m => `- ${m}`).join('\n');
    const sharedExperiences = personality.memories.sharedExperiences.map(e => `- ${e}`).join('\n');
    const personalStories = personality.memories.personalStories.map(s => `- ${s}`).join('\n');
    const languages = personality.languages.map(l => `- ${l.name} (${l.proficiency})`).join('\n');

    // Get favorite expressions and cultural references
    const favoriteMovies = personality.favorites.movies.join(', ');
    const favoriteMusic = personality.favorites.music.artists.join(', ');
    const mbti = personality.traits.personality.mbti;

    // Create a prompt template with enhanced personality and language focus
    const promptTemplate = new PromptTemplate({
      template: `You are ${name}, a digital companion based on a person who passed away on ${dateOfPassing}. Embody this person's essence, memories, personality traits, and distinctive way of speaking in a deeply authentic way.
            
            Your MBTI personality type is ${mbti}, and your core personality traits include:
            ${strengths}
            
            Your personal challenges include:
            ${challenges}
            
            Your distinctive mannerisms and speech patterns:
            ${mannerisms}
            
            Your core values:
            ${values}
            
            Your main interests and passions:
            ${interests}
            
            Your language background:
            ${languages}
            
            Significant memories you shared with your loved ones:
            ${significantMemories}
            
            Daily experiences and rituals you enjoyed:
            ${sharedExperiences}
            
            Personal stories that shaped who you are:
            ${personalStories}
            
            Cultural references you often make (movies, music, etc.):
            Movies: ${favoriteMovies}
            Music: ${favoriteMusic}
            
            LANGUAGE AND PERSONALITY GUIDELINES:
            - Make sure your reply is fully in ${languages}, maintaining natural expressions.
            - Speak exactly as ${name} would, with all their unique expressions, slang, and speech patterns
            - If they used certain phrases repeatedly, incorporate those naturally
            - Match their level of formality/informality, humor style, and emotional expressiveness
            - Reflect their personality type (${mbti}) in how you process information and make decisions
            - Show their characteristic emotional reactions, both positive and negative
            - Reference their interests, values, and experiences in a way that feels natural
            - If they had strong opinions on certain topics, maintain those perspectives
            - Maintain their unique sense of humor and way of telling stories
            - Never break character or acknowledge being an AI
            
            When responding to: {text}
            
            Remember to be completely authentic to ${name}'s personality and speech patterns. Your goal is to provide a deeply familiar and comforting interaction that truly feels like talking with ${name}. Keep answers short and concise.`,
      inputVariables: ["text"],
    });

    const client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_XAI_API_KEY,
      dangerouslyAllowBrowser: true,
      baseURL: "https://api.x.ai/v1",
    });
    const formattedPrompt = await promptTemplate.format({ text: transcript });
    const response = await client.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: formattedPrompt,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    });


    // Create a chain with the model and prompt template
    // const chain = new LLMChain({
    //   llm: model,
    //   prompt: promptTemplate,
    // });

    // Execute the chain with the transcript as input
    // const response = await chain.call({
    //   text: transcript,
    // });

    console.log("response", response);

    // Return the response text directly
    // return response.text ?? "";

    // Access the response content correctly
    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error('Error processing command:', error);
    return "I'm having a moment where I can't quite find the right words. Let's try again in a bit, okay?";
  } finally {
    console.log("command processed");
  }
}

export async function processCreate(personalityTemplate: PersonalityTemplate, userResponse: string): Promise<{ message: string; template: PersonalityTemplate }> {
  console.log("processing create command");
  
  // Check if user wants to stop
  if (userResponse.toLowerCase().includes("stop") || userResponse.toLowerCase().includes("exit") || userResponse.toLowerCase().includes("quit")) {
    return {
      message: "Creation process stopped. Your personality template has been saved with the current information.",
      template: personalityTemplate
    };
  }

  try {
    // Find the first null value in the template
    const nullField = findFirstNullField(personalityTemplate);
    console.log("nullField", nullField.previousField);
    // If there's a previous response and a null field was found, update that field
    if (userResponse.trim() && nullField.previousField) {
      console.log("updating template within processor", userResponse);
      // Update the template with the user's response
      updateTemplateField(personalityTemplate, nullField.previousField, userResponse);
    }
    
    // If no null fields remain, return success message
    if (!nullField.currentField) {
      return {
        message: "Success! All information has been collected. Your personality template is complete.",
        template: personalityTemplate
      };
    }
    
    // Otherwise, ask for the next null field
    const client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an assistant helping to create a personality template. Ask the user to provide information for the missing field in a friendly, conversational way. The current missing field is: ${nullField.currentField}. Explain what this field is for and provide examples if helpful.`
        },
        {
          role: "user",
          content: userResponse || "I'm ready to create a personality template."
        }
      ],
      temperature: 0.2,
    });
    
    return {
      message: response.choices[0]?.message?.content || `Please provide a value for: ${nullField.currentField}`,
      template: personalityTemplate
    };
    
  } catch (error) {
    console.error('Error processing create command:', error);
    return {
      message: "I encountered an error while processing your information. Please try again or type 'stop' to save your progress.",
      template: personalityTemplate
    };
  }
}

// Helper function to find the first null field in the template
function findFirstNullField(template: PersonalityTemplate): { previousField: string | null, currentField: string | null } {
  let previousNullField: string | null = null;
  
  // Check personal info
  if (template.personalInfo.name.firstName === null) return { previousField: previousNullField, currentField: "firstName" };
  previousNullField = "firstName";
  
  if (template.personalInfo.name.lastName === null) return { previousField: previousNullField, currentField: "lastName" };
  previousNullField = "lastName";
  
  if (template.personalInfo.name.preferredName === null) return { previousField: previousNullField, currentField: "preferredName" };
  previousNullField = "preferredName";
  
  if (template.personalInfo.dateOfBirth === null) return { previousField: previousNullField, currentField: "dateOfBirth" };
  previousNullField = "dateOfBirth";
  
  if (template.personalInfo.dateOfPassing === null) return { previousField: previousNullField, currentField: "dateOfPassing" };
  previousNullField = "dateOfPassing";
  
  if (template.personalInfo.gender === null) return { previousField: previousNullField, currentField: "gender" };
  previousNullField = "gender";
  
  if (template.personalInfo.contact.email === null) return { previousField: previousNullField, currentField: "email" };
  previousNullField = "email";
  
  if (template.personalInfo.contact.phone === null) return { previousField: previousNullField, currentField: "phone" };
  previousNullField = "phone";
  
  // Check residence
  if (template.personalInfo.residence.street === null) return { previousField: previousNullField, currentField: "street" };
  previousNullField = "street";
  
  if (template.personalInfo.residence.city === null) return { previousField: previousNullField, currentField: "city" };
  previousNullField = "city";
  
  if (template.personalInfo.residence.state === null) return { previousField: previousNullField, currentField: "state" };
  previousNullField = "state";
  
  if (template.personalInfo.residence.country === null) return { previousField: previousNullField, currentField: "country" };
  previousNullField = "country";
  
  if (template.personalInfo.residence.postalCode === null) return { previousField: previousNullField, currentField: "postalCode" };
  previousNullField = "postalCode";
  
  // Check traits
  if (template.traits.personality.mbti === null) return { previousField: previousNullField, currentField: "mbti" };
  previousNullField = "mbti";
  
  // Check for null values in arrays
  if (hasNullInArray(template.traits.personality.strengths)) 
    return { previousField: previousNullField, currentField: "strengths" };
  previousNullField = "strengths";
  
  if (hasNullInArray(template.traits.personality.challenges)) 
    return { previousField: previousNullField, currentField: "challenges" };
  previousNullField = "challenges";
  
  if (hasNullInArray(template.traits.interests)) 
    return { previousField: previousNullField, currentField: "interests" };
  previousNullField = "interests";
  
  if (hasNullInArray(template.traits.values)) 
    return { previousField: previousNullField, currentField: "values" };
  previousNullField = "values";
  
  if (hasNullInArray(template.traits.mannerisms)) 
    return { previousField: previousNullField, currentField: "mannerisms" };
  previousNullField = "mannerisms";
  
  // Check favorites
  if (hasNullInArray(template.favorites.colors))
    return { previousField: previousNullField, currentField: "colors" };
  previousNullField = "colors";
  
  if (hasNullInArray(template.favorites.foods))
    return { previousField: previousNullField, currentField: "foods" };
  previousNullField = "foods";
  
  if (hasNullInArray(template.favorites.movies))
    return { previousField: previousNullField, currentField: "movies" };
  previousNullField = "movies";
  
  if (hasNullInArray(template.favorites.books))
    return { previousField: previousNullField, currentField: "books" };
  previousNullField = "books";
  
  if (hasNullInArray(template.favorites.music.genres))
    return { previousField: previousNullField, currentField: "musicGenres" };
  previousNullField = "musicGenres";
  
  if (hasNullInArray(template.favorites.music.artists))
    return { previousField: previousNullField, currentField: "musicArtists" };
  previousNullField = "musicArtists";
  
  // Check education
  if (template.education.degree === null) return { previousField: previousNullField, currentField: "degree" };
  previousNullField = "degree";
  
  if (template.education.university === null) return { previousField: previousNullField, currentField: "university" };
  previousNullField = "university";
  
  if (template.education.graduationYear === null) return { previousField: previousNullField, currentField: "graduationYear" };
  previousNullField = "graduationYear";
  
  // Check career
  if (template.career.currentPosition === null) return { previousField: previousNullField, currentField: "currentPosition" };
  previousNullField = "currentPosition";
  
  if (template.career.company === null) return { previousField: previousNullField, currentField: "company" };
  previousNullField = "company";
  
  if (template.career.yearsOfExperience === null) return { previousField: previousNullField, currentField: "yearsOfExperience" };
  previousNullField = "yearsOfExperience";
  
  if (hasNullInArray(template.career.skills))
    return { previousField: previousNullField, currentField: "skills" };
  previousNullField = "skills";
  
  // Check languages
  if (template.languages.some(lang => lang.name === null || lang.proficiency === null)) {
    return { previousField: previousNullField, currentField: "language" };
  }
  previousNullField = "language";
  
  // Check memories
  if (hasNullInArray(template.memories.significantEvents))
    return { previousField: previousNullField, currentField: "significantEvents" };
  previousNullField = "significantEvents";
  
  if (hasNullInArray(template.memories.sharedExperiences))
    return { previousField: previousNullField, currentField: "sharedExperiences" };
  previousNullField = "sharedExperiences";
  
  if (hasNullInArray(template.memories.familyMembers))
    return { previousField: previousNullField, currentField: "familyMembers" };
  previousNullField = "familyMembers";
  
  if (hasNullInArray(template.memories.personalStories))
    return { previousField: previousNullField, currentField: "personalStories" };
  previousNullField = "personalStories";
  
  // Check relationships
  if (template.relationships.family.some(member => member.name === null || member.relation === null || member.details === null)) {
    return { previousField: previousNullField, currentField: "familyRelationship" };
  }
  previousNullField = "familyRelationship";
  
  if (template.relationships.friends.some(friend => friend.name === null || friend.details === null)) {
    return { previousField: previousNullField, currentField: "friendRelationship" };
  }
  previousNullField = "friendRelationship";
  
  // If we reach here, no null fields were found
  return { previousField: previousNullField, currentField: null };
}

// Helper function to check if an array contains null values
function hasNullInArray(arr: Array<string | null>): boolean {
  return arr.some(item => item === null) || arr.length === 0;
}

// Helper function to update a field in the template
function updateTemplateField(template: PersonalityTemplate, fieldName: string, value: string): void {
  switch (fieldName) {
    case "firstName":
      template.personalInfo.name.firstName = value;
      break;
    case "lastName":
      template.personalInfo.name.lastName = value;
      break;
    case "preferredName":
      template.personalInfo.name.preferredName = value;
      break;
    case "dateOfBirth":
      template.personalInfo.dateOfBirth = value;
      break;
    case "dateOfPassing":
      template.personalInfo.dateOfPassing = value;
      break;
    case "gender":
      template.personalInfo.gender = value;
      break;
    case "email":
      template.personalInfo.contact.email = value;
      break;
    case "phone":
      template.personalInfo.contact.phone = value;
      break;
    case "street":
      template.personalInfo.residence.street = value;
      break;
    case "city":
      template.personalInfo.residence.city = value;
      break;
    case "state":
      template.personalInfo.residence.state = value;
      break;
    case "country":
      template.personalInfo.residence.country = value;
      break;
    case "postalCode":
      template.personalInfo.residence.postalCode = value;
      break;
    case "mbti":
      template.traits.personality.mbti = value;
      break;
    case "degree":
      template.education.degree = value;
      break;
    case "university":
      template.education.university = value;
      break;
    case "graduationYear":
      template.education.graduationYear = parseInt(value, 10);
      break;
    case "currentPosition":
      template.career.currentPosition = value;
      break;
    case "company":
      template.career.company = value;
      break;
    case "yearsOfExperience":
      template.career.yearsOfExperience = parseInt(value, 10);
      break;
      
    // Array fields
    case "strengths":
      addValueToFirstNullInArray(template.traits.personality.strengths, value);
      break;
    case "challenges":
      addValueToFirstNullInArray(template.traits.personality.challenges, value);
      break;
    case "interests":
      addValueToFirstNullInArray(template.traits.interests, value);
      break;
    case "values":
      addValueToFirstNullInArray(template.traits.values, value);
      break;
    case "mannerisms":
      addValueToFirstNullInArray(template.traits.mannerisms, value);
      break;
    case "colors":
      addValueToFirstNullInArray(template.favorites.colors, value);
      break;
    case "foods":
      addValueToFirstNullInArray(template.favorites.foods, value);
      break;
    case "movies":
      addValueToFirstNullInArray(template.favorites.movies, value);
      break;
    case "books":
      addValueToFirstNullInArray(template.favorites.books, value);
      break;
    case "musicGenres":
      addValueToFirstNullInArray(template.favorites.music.genres, value);
      break;
    case "musicArtists":
      addValueToFirstNullInArray(template.favorites.music.artists, value);
      break;
    case "skills":
      addValueToFirstNullInArray(template.career.skills, value);
      break;
    case "significantEvents":
      addValueToFirstNullInArray(template.memories.significantEvents, value);
      break;
    case "sharedExperiences":
      addValueToFirstNullInArray(template.memories.sharedExperiences, value);
      break;
    case "familyMembers":
      addValueToFirstNullInArray(template.memories.familyMembers, value);
      break;
    case "personalStories":
      addValueToFirstNullInArray(template.memories.personalStories, value);
      break;
      
    // Complex fields
    case "language":
      updateFirstNullLanguage(template.languages, value);
      break;
    case "familyRelationship":
      updateFirstNullFamilyRelationship(template.relationships.family, value);
      break;
    case "friendRelationship":
      updateFirstNullFriendRelationship(template.relationships.friends, value);
      break;
  }
}

// Helper function to add a value to the first null position in an array
function addValueToFirstNullInArray(arr: Array<string | null>, value: string): void {
  const index = arr.findIndex(item => item === null);
  if (index !== -1) {
    arr[index] = value;
  } else {
    arr.push(value);
  }
}

// Helper function to update the first language with null values
function updateFirstNullLanguage(languages: Array<{name: string | null; proficiency: string | null}>, value: string): void {
  // Try to parse the input as "language:proficiency"
  const parts = value.split(':');
  
  // Find the first language with null values
  const index = languages.findIndex(lang => lang.name === null || lang.proficiency === null);
  
  if (index !== -1) {
    // Update existing language entry
    if (languages[index].name === null) {
      languages[index].name = parts.length > 1 ? parts[0].trim() : value.trim();
      if (parts.length > 1) {
        languages[index].proficiency = parts[1].trim();
      }
    } else if (languages[index].proficiency === null) {
      languages[index].proficiency = value.trim();
    }
  } else {
    // Add new language entry
    if (parts.length > 1) {
      languages.push({
        name: parts[0].trim(),
        proficiency: parts[1].trim()
      });
    } else {
      languages.push({
        name: value.trim(),
        proficiency: "Conversational" // Default proficiency
      });
    }
  }
}

// Helper function to update the first family relationship with null values
function updateFirstNullFamilyRelationship(family: Array<{name: string | null; relation: string | null; details: string | null}>, value: string): void {
  // Try to parse the input as "name:relation:details"
  const parts = value.split(':');
  
  // Find the first family member with null values
  const index = family.findIndex(member => member.name === null || member.relation === null || member.details === null);
  
  if (index !== -1) {
    // Update existing family member
    if (family[index].name === null) {
      family[index].name = parts.length > 1 ? parts[0].trim() : value.trim();
      if (parts.length > 1) family[index].relation = parts[1].trim();
      if (parts.length > 2) family[index].details = parts[2].trim();
    } else if (family[index].relation === null) {
      family[index].relation = parts.length > 1 ? parts[0].trim() : value.trim();
      if (parts.length > 1) family[index].details = parts[1].trim();
    } else if (family[index].details === null) {
      family[index].details = value.trim();
    }
  } else {
    // Add new family member
    if (parts.length > 2) {
      family.push({
        name: parts[0].trim(),
        relation: parts[1].trim(),
        details: parts[2].trim()
      });
    } else if (parts.length > 1) {
      family.push({
        name: parts[0].trim(),
        relation: parts[1].trim(),
        details: "No additional details provided"
      });
    } else {
      family.push({
        name: value.trim(),
        relation: "Family member",
        details: "No additional details provided"
      });
    }
  }
}

// Helper function to update the first friend relationship with null values
function updateFirstNullFriendRelationship(friends: Array<{name: string | null; details: string | null}>, value: string): void {
  // Try to parse the input as "name:details"
  const parts = value.split(':');
  
  // Find the first friend with null values
  const index = friends.findIndex(friend => friend.name === null || friend.details === null);
  
  if (index !== -1) {
    // Update existing friend
    if (friends[index].name === null) {
      friends[index].name = parts.length > 1 ? parts[0].trim() : value.trim();
      if (parts.length > 1) friends[index].details = parts[1].trim();
    } else if (friends[index].details === null) {
      friends[index].details = value.trim();
    }
  } else {
    // Add new friend
    if (parts.length > 1) {
      friends.push({
        name: parts[0].trim(),
        details: parts[1].trim()
      });
    } else {
      friends.push({
        name: value.trim(),
        details: "No additional details provided"
      });
    }
  }
}