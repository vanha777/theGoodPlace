import { createClient } from '@supabase/supabase-js'
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import OpenAI from "openai";
import { Connection, PublicKey } from '@solana/web3.js';
import { Message } from '@/components/models/ChatSimulatorV2';
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
  latestMemory?: EmotionalContext;
  // career: {
  //   currentPosition: string | null;
  //   company: string | null;
  //   yearsOfExperience: number | null;
  //   skills: Array<string | null>;
  // };
  languages: {
    language: Array<{
      name: string | null;
      proficiency: string | null;
    }>;
  };
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

type EmotionalContext = {
  who: string;
  what: string;
  when: string;
  why: string;
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

// Fetch personality from URL with fallback to default
export async function fetchPersonality(url: string): Promise<PersonalityTemplate | null> {
  try {
    // URL to fetch personality data from
    const personalityUrl = url || 'https://your-default-url.com/personality.json';

    const response = await fetch(personalityUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch personality data: ${response.status} ${response.statusText}`);
      return null;
    }

    const personalityData = await response.json();
    console.log("response", personalityData);
    return personalityData as PersonalityTemplate;
  } catch (error) {
    console.error('Error fetching personality data:', error);
    return null;
  }
}


export default async function processCommand(transcript: string, personality: PersonalityTemplate): Promise<string> {
  console.log("processing command");
  if (!transcript.trim()) return "";

  try {
    // Fetch personality data from URL instead of using default directly
    // let personality = await fetchPersonality(url);

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
    const languages = personality.languages.language.map(l => `- ${l.name} (${l.proficiency})`).join('\n');

    // Add latest memory formatting
    const latestMemory = personality.latestMemory;
    const formattedLatestMemory = latestMemory?.who || latestMemory?.what || latestMemory?.when || latestMemory?.why
      ? `Who: ${latestMemory?.who || 'unknown'}
What: ${latestMemory?.what || 'unknown'}
When: ${latestMemory?.when || 'unknown'}
Why: ${latestMemory?.why || 'unknown'}`
      : 'null';

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

            Your latest memory:
            ${formattedLatestMemory}
            
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
            - If the latest memory exists, start with it and reflect relevant emotions.
            
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

export async function processCreate(personalityTemplate: PersonalityTemplate, userResponse: string): Promise<{ message: string; template: PersonalityTemplate, action?: string, uri?: string }> {
  console.log("processing create command");

  // Check if user wants to stop
  if (userResponse.toLowerCase().includes("stop now") || userResponse.toLowerCase().includes("exit chat")) {
    return {
      message: "Creation process stopped. Your template has been saved.",
      template: personalityTemplate
    };
  }

  if (userResponse.toLowerCase().includes("upload")) {
    try {
      const uuid = crypto.randomUUID();
      const { url } = await uploadPersonalityToSupabase(personalityTemplate, uuid);
      if (url) {
        console.log("Successfully uploaded personality to Supabase", url);
        return {
          message: " All done, we've immortalized the person you've created on the blockchain",
          template: personalityTemplate,
          action: "completed",
          uri: url
        };
      }
    } catch (error) {
      console.error("Error uploading personality to Supabase:", error);
      return {
        message: "Please edit the person and try again.",
        template: personalityTemplate
      };
    }


  }

  try {
    // Add a progress tracker to the template if it doesn't exist
    if (!("_currentSection" in personalityTemplate as any)) {
      (personalityTemplate as any)._currentSection = "start";
    }

    const currentSection = (personalityTemplate as any)._currentSection;
    console.log("Current section:", currentSection);

    // If this is the first interaction, just ask for personal info
    if (currentSection === "start") {
      const client = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      // If this isn't just a greeting, process the response as personal info
      if (userResponse &&
        !userResponse.toLowerCase().includes("hello") &&
        !userResponse.toLowerCase().includes("hi") &&
        !userResponse.toLowerCase().includes("hey") &&
        !userResponse.toLowerCase().includes("create")) {

        // Update the template with the user's response for personal info
        const updatedTemplate = await updateSectionWithAI(personalityTemplate, "personalInfo", userResponse);
        personalityTemplate = updatedTemplate;

        // Move to the next section
        (personalityTemplate as any)._currentSection = "traits";

        // Ask for traits
        const response = await client.chat.completions.create({
          model: "o3-mini",
          messages: [
            {
              role: "system",
              content: `You're helping user to create a personality profile of their passed away loved one. Keep your response short and conversational. Thank the user briefly for the personal info, then ask about traits (personality type, strengths, challenges, interests, values, mannerisms). Max 2 sentences.`
            },
            {
              role: "user",
              content: userResponse
            }
          ],
        });

        return {
          message: response.choices[0]?.message?.content || "Thanks! Now tell me about their personality traits, strengths, and interests.",
          template: personalityTemplate
        };
      }

      // First interaction - ask for personal info
      const response = await client.chat.completions.create({
        model: "o3-mini",
        messages: [
          {
            role: "system",
            content: `You're helping create a personality profile. Keep your response short and conversational. Welcome the user briefly and ask for basic personal info (name, birth date, etc). Max 2-3 sentences.`
          },
          {
            role: "user",
            content: userResponse || "I'm ready to create a personality template."
          }
        ],
      });

      return {
        message: response.choices[0]?.message?.content || "Hi! Let's create a personality profile. What's their name, birth date, and gender?",
        template: personalityTemplate
      };
    }

    // Process the user's response for the current section
    if (userResponse.trim()) {
      // Update the template with the user's response for the current section
      const updatedTemplate = await updateSectionWithAI(personalityTemplate, currentSection, userResponse);
      personalityTemplate = updatedTemplate;
    }

    // Determine the next section to ask about
    const nextSection = getNextSection(currentSection);

    // Update the current section
    (personalityTemplate as any)._currentSection = nextSection;

    // If we've completed all sections, ask if the user wants to finish or update any section
    if (nextSection === "finish") {
      // const client = new OpenAI({
      //   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      //   dangerouslyAllowBrowser: true,
      // });

      // const response = await client.chat.completions.create({
      //   model: "o3-mini",
      //   messages: [
      //     {
      //       role: "system",
      //       content: `You're helping create a personality profile. Keep your response short and conversational. The user has completed all sections. Ask if they want to finish or update any section. Max 2 sentences.`
      //     },
      //     {
      //       role: "user",
      //       content: userResponse
      //     }
      //   ],
      // });

      console.log("finish inside processor")

      return {
        message: "All done! Want to upload or you can edit anything in Button `Person` i've created above?",
        template: personalityTemplate
      };
    }

    // Ask for the next section
    const client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Create section-specific prompts that are short and natural
    let promptContent = "";
    switch (nextSection) {
      case "traits":
        promptContent = "Ask briefly about personality traits, strengths, and interests.";
        break;
      case "favorites":
        promptContent = "Ask briefly about favorite colors, foods, movies, books, and music.";
        break;
      case "languages":
        promptContent = "Ask briefly about languages they speak and proficiency levels.";
        break;
      case "memories":
        promptContent = "Ask briefly about significant memories, experiences, and personal stories.";
        break;
      case "relationships":
        promptContent = "Ask briefly about family members and friends.";
        break;
      default:
        promptContent = `Ask briefly about the ${nextSection} section.`;
    }

    const response = await client.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "system",
          content: `You're helping create a personality profile. Keep your response short and conversational. ${promptContent} Max 2 sentences.`
        },
        {
          role: "user",
          content: userResponse
        }
      ],
    });

    return {
      message: response.choices[0]?.message?.content || getDefaultQuestion(nextSection),
      template: personalityTemplate
    };

  } catch (error) {
    console.error('Error processing create command:', error);
    return {
      message: "Sorry, something went wrong. Try again or type 'stop' to save your progress.",
      template: personalityTemplate
    };
  }
}

// Helper function to get default short questions for each section
function getDefaultQuestion(section: string): string {
  switch (section) {
    case "personalInfo":
      return "What's their name, birth date, and gender?";
    case "traits":
      return "What's their personality like? Any strengths or interests?";
    case "favorites":
      return "What are some of their favorite things - colors, foods, movies?";
    case "languages":
      return "What languages do they speak?";
    case "memories":
      return "Any significant memories or personal stories to share?";
    case "relationships":
      return "Tell me about their family and friends.";
    default:
      return `What about their ${section}?`;
  }
}

// Helper function to get the next section
function getNextSection(currentSection: string): string {
  switch (currentSection) {
    case "start":
      return "personalInfo";
    case "personalInfo":
      return "traits";
    case "traits":
      return "favorites";
    case "favorites":
      return "languages";
    case "languages":
      return "memories";
    case "memories":
      return "relationships";
    case "relationships":
      return "finish";
    default:
      return "finish";
  }
}

// Helper function to update a section with AI assistance
async function updateSectionWithAI(template: PersonalityTemplate, section: string, userResponse: string): Promise<PersonalityTemplate> {
  const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Extract the current section data
  let sectionData: any;
  switch (section) {
    case "personalInfo":
      sectionData = template.personalInfo;
      break;
    case "traits":
      sectionData = template.traits;
      break;
    case "favorites":
      sectionData = template.favorites;
      break;
    // case "education":
    //   sectionData = template.education;
    //   break;
    // case "career":
    //   sectionData = template.career;
    //   break;
    case "languages":
      sectionData = template.languages;
      break;
    case "memories":
      sectionData = template.memories;
      break;
    case "relationships":
      sectionData = template.relationships;
      break;
    default:
      return template;
  }

  // Ask AI to update the section based on user response
  const response = await client.chat.completions.create({
    model: "o3-mini",
    messages: [
      {
        role: "system",
        content: `You are an assistant helping to create a personality template. The user has provided information for the "${section}" section. 
        Current data for this section: ${JSON.stringify(sectionData, null, 2)}
        
        Based on the user's response, update this section data. Return ONLY a valid JSON object for the updated section, nothing else.`
      },
      {
        role: "user",
        content: userResponse
      }
    ],
    response_format: { type: "json_object" },
  });

  try {
    const updatedSectionData = JSON.parse(response.choices[0]?.message?.content || "{}");

    // Update the template with the new section data
    switch (section) {
      case "personalInfo":
        template.personalInfo = updatedSectionData;
        break;
      case "traits":
        template.traits = updatedSectionData;
        break;
      case "favorites":
        template.favorites = updatedSectionData;
        break;
      // case "education":
      //   template.education = updatedSectionData;
      // break;
      // case "career":
      //   template.career = updatedSectionData;
      // break;
      case "languages":
        template.languages = updatedSectionData;
        break;
      case "memories":
        template.memories = updatedSectionData;
        break;
      case "relationships":
        template.relationships = updatedSectionData;
        break;
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  return template;
}

/**
 * Uploads a personality template to Supabase storage
 * @param personalityTemplate The personality template to upload
 * @param filename The name to save the file as (without extension)
 * @returns Object containing success status and message or error
 */
export async function uploadPersonalityToSupabase(
  personalityTemplate: PersonalityTemplate,
  filename: string
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    // Remove any internal tracking properties before saving
    const templateToSave = { ...personalityTemplate };
    if ('_currentSection' in templateToSave as any) {
      delete (templateToSave as any)._currentSection;
    }

    // Convert the template to a JSON string
    const jsonData = JSON.stringify(templateToSave, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Sanitize filename - remove spaces and special characters
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9]/g, '') || 'personality';
    const fullFilename = `${sanitizedFilename}.json`;

    // Upload to Supabase storage
    const { data, error } = await Db.storage
      .from('general')
      .upload(fullFilename, blob, {
        cacheControl: '3600',
        upsert: true // Overwrite if file exists
      });

    if (error) {
      console.error('Error uploading personality template:', error);
      return {
        success: false,
        message: `Failed to upload: ${error.message}`
      };
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = Db.storage
      .from('general')
      .getPublicUrl(fullFilename);

    return {
      success: true,
      message: 'Personality template uploaded successfully!',
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error in uploadPersonalityToSupabase:', error);
    return {
      success: false,
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Check if a PDA exists for the given entry seed
 * @param connection Solana connection
 * @param programId Your program's ID
 * @param entrySeed The entry seed public key
 * @returns Promise<boolean> Whether the PDA exists
 */
export async function checkIfPdaExists(
  connection: Connection,
  entrySeed: PublicKey
): Promise<string | null> {
  const programId = new PublicKey(process.env.NEXT_PUBLIC_THE_GOOD_PLACE_PROGRAM_ID || "");
  try {
    // Derive the PDA address using the same seeds as your program
    const [pdaAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("thegoodplace"),
        entrySeed.toBuffer()
      ],
      programId
    );

    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(pdaAddress);

    // If accountInfo is not null, the account exists
    return accountInfo ? pdaAddress.toString() : null;
  } catch (error) {
    console.error("Error checking PDA existence:", error);
    return null;
  }
}

/**
 * Type definition for the parsed PDA account data
 */
export type PersonalTraitsAccount = {
  address: string;
  name: string;
  uri: string;
  authority: string;
  bump: number;
};

/**
 * Parse data from a PersonalTraits PDA account
 * @param connection Solana connection
 * @param entrySeed The entry seed public key
 * @returns Promise with parsed account data or null if account doesn't exist
 */
export async function parsePdaAccountData(
  connection: Connection,
  entrySeed: PublicKey
): Promise<PersonalTraitsAccount | null> {
  console.log("parsing PDA");
  const programId = new PublicKey(process.env.NEXT_PUBLIC_THE_GOOD_PLACE_PROGRAM_ID || "");
  try {
    // Derive the PDA address using the same seeds as your program
    const [pdaAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("thegoodplace"),
        entrySeed.toBuffer()
      ],
      programId
    );

    // Get the account info
    const accountInfo = await connection.getAccountInfo(pdaAddress);

    // If account doesn't exist, return null
    if (!accountInfo) {
      return null;
    }

    // Parse the account data based on your program's data structure
    const dataBuffer = accountInfo.data;

    // Skip discriminator (first 8 bytes)
    let offset = 8;

    // Parse name (String - 4 bytes for length + variable content)
    const nameLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    const name = dataBuffer.slice(offset, offset + nameLength).toString('utf8');
    offset += nameLength;

    // Parse uri (String - 4 bytes for length + variable content)
    const uriLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    const uri = dataBuffer.slice(offset, offset + uriLength).toString('utf8');
    offset += uriLength;

    // Parse authority (Pubkey - 32 bytes)
    const authority = new PublicKey(dataBuffer.slice(offset, offset + 32));
    offset += 32;

    // Parse bump (u8 - 1 byte)
    const bump = dataBuffer[offset];

    // Return the parsed data
    return {
      address: pdaAddress.toString(),
      name,
      uri,
      authority: authority.toString(),
      bump
    };

  } catch (error) {
    console.error("Error parsing PDA account data:", error);
    return null;
  }
}

/**
 * Parse data from an Emotions PDA account
 * @param connection Solana connection
 * @param entrySeed The entry seed public key
 * @returns Promise with parsed emotions data or null if account doesn't exist
 */
export async function parseEmotionsPdaData(
  connection: Connection,
  entrySeed: PublicKey
): Promise<EmotionalContext | null> {
  console.log("parsing Emotions PDA");
  const programId = new PublicKey(process.env.NEXT_PUBLIC_THE_GOOD_PLACE_PROGRAM_ID || "");
  try {
    // Derive the PDA address using the same seeds as your program
    const [pdaAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("emotions"),  // Matches Rust seeds = [b"emotions", ...]
        entrySeed.toBuffer()
      ],
      programId
    );

    // Get the account info
    const accountInfo = await connection.getAccountInfo(pdaAddress);

    // If account doesn't exist, return null
    if (!accountInfo) {
      return null;
    }

    // Parse the account data based on your program's data structure
    const dataBuffer = accountInfo.data;

    // Skip discriminator (first 8 bytes)
    let offset = 8;

    // Parse who (String - 4 bytes for length + up to 100 bytes content)
    const whoLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    const who = dataBuffer.slice(offset, offset + whoLength).toString('utf8');
    offset += whoLength;

    // Parse what (String - 4 bytes for length + up to 100 bytes content)
    const whatLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    const what = dataBuffer.slice(offset, offset + whatLength).toString('utf8');
    offset += whatLength;

    // Parse when (String - 4 bytes for length + up to 100 bytes content)
    const whenLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    const when = dataBuffer.slice(offset, offset + whenLength).toString('utf8');
    offset += whenLength;

    // Parse where (String - 4 bytes for length + up to 100 bytes content)
    const whereLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    const where = dataBuffer.slice(offset, offset + whereLength).toString('utf8');
    offset += whereLength;

    // Parse why (String - 4 bytes for length + up to 100 bytes content)
    const whyLength = dataBuffer.readUInt32LE(offset);
    offset += 4;
    const why = dataBuffer.slice(offset, offset + whyLength).toString('utf8');
    offset += whyLength;

    // Skip authority (32 bytes) and bump (1 byte) as they're not needed in the return type
    // offset += 33;  // Uncomment if you need to parse more fields after these

    // Return the parsed data
    return {
      who,
      what,
      when,
      why
    };

  } catch (error) {
    console.error("Error parsing Emotions PDA data:", error);
    return null;
  }
}

/**
 * Converts text to speech using a text-to-speech API
 * @param text The text to convert to speech
 * @param voice Optional voice ID or name to use (defaults to a standard voice)
 * @returns Promise with the audio URL or null if conversion failed
 */
export async function textToSpeech(
  text: string,
  voice?: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    if (!text.trim()) {
      return {
        success: false,
        error: "Text cannot be empty"
      };
    }

    // Use OpenAI's TTS API
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Default voice if not specified
    const voiceId = voice || "alloy"; // OpenAI voices: alloy, echo, fable, onyx, nova, shimmer

    // Call the OpenAI TTS API
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voiceId as "alloy" | "ash" | "coral" | "echo" | "fable" | "onyx" | "nova" | "sage" | "shimmer",
      input: text,
    });

    // Convert the response to a blob
    const blob = await response.blob();

    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(blob);

    return {
      success: true,
      audioUrl
    };
  } catch (error) {
    console.error('Error in text-to-speech conversion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Alternative implementation using ElevenLabs if you prefer
export async function textToSpeechElevenLabs(
  text: string,
  voiceId?: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    if (!text.trim()) {
      return {
        success: false,
        error: "Text cannot be empty"
      };
    }

    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "ElevenLabs API key is missing"
      };
    }

    // Default voice if not specified (using ElevenLabs default voice ID)
    const voice = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default ElevenLabs voice

    // Call the ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to convert text to speech");
    }

    // Get the audio data
    const audioBlob = await response.blob();

    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      success: true,
      audioUrl
    };
  } catch (error) {
    console.error('Error in ElevenLabs text-to-speech conversion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function analyzeEmotionsFromConversation(
  conversations: Message[]
): Promise<EmotionalContext> {
  try {
    const client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Format conversations for analysis
    const conversationText = conversations
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    console.log("conversationText", conversationText);
    
    const response = await client.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "system",
          content: `Analyze the following conversation and extract emotional context. 
          Respond in JSON format with the following structure. Each field must be 100 characters or less:
          {
            "who": "The main people involved (max 100 chars)",
            "what": "The main emotional event or interaction (max 100 chars)",
            "when": "The temporal context (max 100 chars)",
            "why": "The reason or trigger (max 100 chars)"
          }
          
          Be concise and focus on key emotional elements.`
        },
        {
          role: "user",
          content: conversationText
        }
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}");

    // Ensure all fields exist with fallbacks and are truncated to 100 chars
    const emotionalContext: EmotionalContext = {
      who: (analysis.who || "Unknown participant").slice(0, 100),
      what: (analysis.what || "Unspecified interaction").slice(0, 100),
      when: (analysis.when || "Recent moment").slice(0, 100),
      why: (analysis.why || "Unknown reason").slice(0, 100)
    };

    return emotionalContext;
  } catch (error) {
    console.error('Error analyzing emotions:', error);
    // Return default emotional context if analysis fails
    return {
      who: "Analysis failed",
      what: "Error processing conversation",
      when: "Unknown",
      why: "Error in emotional analysis"
    };
  }
}

