import { createClient } from '@supabase/supabase-js'
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import OpenAI from "openai";
// Replace with your Supabase project URL and Anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


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
